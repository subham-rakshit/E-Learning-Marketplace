import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/dbConnection'
import { validateUser } from '@/lib/middlewares/validateUser'
import ImageModel from '@/models/image/image'
import { awsS3ClientDeleteImage } from '@/lib/aws/awsS3ClientActions'

export async function DELETE(request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    const userId = searchParams.get('userId')
    const userRole = searchParams.get('userRole')

    // Check if the imageId and userId are present in the request body
    if (!imageId || !userId || !userRole) {
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

    // Make sure the image can be delete only the uploader and the admin
    const imageDetails =
      userRole === 'Admin'
        ? await ImageModel.findById(imageId)
        : await ImageModel.findOne({
            _id: imageId,
            userId: requestedUserDetails._id
          })
    if (
      userRole.includes(['Instructor', 'Subscriber']) &&
      imageDetails.userId !== requestedUserDetails._id
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. Permission denied to delete image.'
        },
        { status: 403 }
      )
    }

    // Delete the image from AWS S3
    const awsS3ClientResponse = await awsS3ClientDeleteImage(
      imageDetails.imageS3Key
    )
    if (!awsS3ClientResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: awsS3ClientResponse.message
        },
        { status: 400 }
      )
    }

    // Delete the image from DB
    const deletedImage = await ImageModel.findByIdAndDelete(imageId)
    if (!deletedImage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Image not found.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Image deleted successfully.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(`Error in delete-perticular-image route: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          'Something went wrong deleting image. Please try again.'
      },
      { status: 500 }
    )
  }
}
