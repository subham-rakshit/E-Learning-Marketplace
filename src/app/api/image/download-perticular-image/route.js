import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/dbConnection'
import { validateUser } from '@/lib/middlewares/validateUser'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import ImageModel from '@/models/image/image'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export async function GET(request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    const userId = searchParams.get('userId')

    // Check if the imageId and userId are present in the request body
    if (!imageId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request. Please check the request body.'
        },
        { status: 400 }
      )
    }

    // Authorization check to ensure the correct user is making the request
    const requestedUserDetails = await validateUser({ request })
    if (requestedUserDetails._id !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. Permission denied.'
        },
        { status: 403 }
      )
    }

    // Get the image from DB
    const imageRecord = await ImageModel.findById(imageId)
    if (!imageRecord) {
      return NextResponse.json(
        {
          success: false,
          message: 'Image not found.'
        },
        { status: 400 }
      )
    }

    // Image AWS key
    const imageKey = imageRecord.imageS3Key

    // Fetch the image from S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: imageKey
    }
    const response = await s3Client.send(new GetObjectCommand(params))

    // Send the reponse
    if (response['$metadata'].httpStatusCode === 200) {
      return new NextResponse(response.Body, {
        status: 200,
        headers: {
          'Content-Type': response.ContentType,
          'Content-Length': response.ContentLength,
          'Content-Disposition': `attachment; filename="${imageRecord.imageFileName}"`
        }
      })
    }
  } catch (error) {
    console.log(`Error in download-perticular-image route: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          'Something went wrong downloading image. Please try again.'
      },
      { status: 500 }
    )
  }
}
