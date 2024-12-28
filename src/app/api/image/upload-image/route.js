import dbConnect from '@/lib/db/dbConnection'
import { validateUser } from '@/lib/middlewares/validateUser'
import UserModel from '@/models/user/user'
import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { nanoid } from 'nanoid'
import { imagesSchema } from '@/lib/schemas/images/imagesSchema'
import ImageModel from '@/models/image/image'
import { awsS3ClientUploadNewImage } from '@/lib/aws/awsS3ClientActions'

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
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. You are not permitted to upload image.'
        },
        { status: 400 }
      )
    }

    // Check in DB if imageFileName already exists or not
    const imageExists = await ImageModel.findOne({
      imageFileName,
      userId: requestedUserDetails._id
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

    // Perform AWS S3 upload
    const awsS3ClientResponse = await awsS3ClientUploadNewImage(image)
    if (!awsS3ClientResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: awsS3ClientResponse.message
        },
        { status: 400 }
      )
    }

    // Create the image validation object
    const { imageUrl, imageParams, imageType } = awsS3ClientResponse
    const imageValidationObj = {
      userId: requestedUserDetails._id,
      uploaderInfo: {
        name: user.username,
        role: user.role[0]
      },
      imageS3Key: imageParams.Key,
      imageFileName,
      imageType,
      imageUrl
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
        message: error.message
      },
      { status: 500 }
    )
  }
}
