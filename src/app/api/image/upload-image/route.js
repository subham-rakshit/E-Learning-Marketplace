import dbConnect from '@/lib/db/dbConnection'
import { validateUser } from '@/lib/middlewares/validateUser'
import UserModel from '@/models/user/user'
import { NextResponse } from 'next/server'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { nanoid } from 'nanoid'
import { imagesSchema } from '@/lib/schemas/images/imagesSchema'
import ImageModel from '@/models/image/image'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export async function POST(request) {
  await dbConnect()
  try {
    const body = await request.json()
    const { image, imageFileName, userId } = body

    // Check if the image and userId are present in the request body
    if (!image || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request. Please check the request body.'
        },
        { status: 400 }
      )
    }

    // Getting the requested user details from NextAuth token (middleware)
    const requestedUserDetails = await validateUser({ request })

    // Authorization check to ensure the correct user is making the request
    if (requestedUserDetails._id !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. Permission denied.'
        },
        { status: 403 }
      )
    }

    // Get the request user details and check if the user has a stripe_seller_info obj
    const user = await UserModel.findById(requestedUserDetails._id)
    if (!user || !user.stripe_seller_info) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. You are not permitted to upload image.'
        },
        { status: 400 }
      )
    }

    // TODO Check in DB if imageFileName already exists or not
    const imageExists = await ImageModel.findOne({
      imageFileName
    })

    if (imageExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Image already exists. Please find the image in your gallery.'
        },
        { status: 400 }
      )
    }

    // Prepare the S3 upload params
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )
    const imageType = image.split(';')[0].split('/')[1] // data:image/png;base64 -> data:image/png -> png
    const imageParams = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: `${nanoid()}.${imageType}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${imageType}`
    }

    // Upload the image to S3
    const command = new PutObjectCommand(imageParams)
    const result = await s3Client.send(command)

    // Construct the public URL for the uploaded image
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageParams.Key}`

    // Create the image validation object
    const imageValidationObj = {
      userId: requestedUserDetails._id,
      imageS3Key: imageParams.Key,
      imageFileName: imageFileName,
      imageType: imageType,
      imageUrl: imageUrl
    }

    // Validate the image
    const validationResult = imagesSchema.safeParse(imageValidationObj)
    if (!validationResult.success) {
      let zodErrors = {}
      result.error.issues.forEach(issue => {
        zodErrors = {
          ...zodErrors,
          [issue.path[0]]: { message: issue.message }
        }
      })

      return NextResponse.json(
        { success: false, errors: zodErrors },
        { status: 400 }
      )
    }

    // Create a new image and save it to the DB
    const newImage = new ImageModel(imageValidationObj)
    await newImage.save()

    // Send the response
    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        url: imageUrl
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(`Error in upload-image route: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: error
      },
      { status: 500 }
    )
  }
}
