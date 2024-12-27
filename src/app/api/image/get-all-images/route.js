import dbConnect from '@/lib/db/dbConnection'
import ImageModel from '@/models/image/image'
import UserModel from '@/models/user/user'
import { NextResponse } from 'next/server'

export async function GET(request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const user = await UserModel.findById(userId)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'UnAuthorized access. You are not permitted to view images.'
        },
        { status: 400 }
      )
    }

    // Get all images from the DB
    const allImages = await ImageModel.find(
      user.role.includes('Admin') ? {} : { userId: user._id }
    )

    return NextResponse.json(
      {
        success: true,
        images: allImages
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(`Error in get-all-images route: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message:
          error || 'Something went wrong getting all images. Please try again.'
      },
      { status: 500 }
    )
  }
}
