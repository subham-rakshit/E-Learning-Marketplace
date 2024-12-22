import dbConnect from '@/lib/db/dbConnection'
import { deleteUserEmailConfig } from '@/lib/emails/sendEmail'
import { validateUser } from '@/lib/middlewares/validateUser'
import UserModel from '@/models/user/user'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // Authentication checks
    const requestedUserDetails = await validateUser({ request })

    // Authorization check
    if (requestedUserDetails._id !== body.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Unauthorized access. You do not have permission to delete this account.'
        },
        { status: 403 }
      )
    }

    // Admin Authorization check
    if (requestedUserDetails.role.includes('Admin')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admins are not allowed to delete their own accounts.'
        },
        { status: 403 }
      )
    }

    // Delete the user account functionalities
    await UserModel.findByIdAndDelete(requestedUserDetails._id)

    // Response
    const userDeleteFromDbAndAWSResponse = await deleteUserEmailConfig({
      email: requestedUserDetails.email,
      successMsg: 'Account deleted successfully.',
      errorMsg: 'Error deleting account.'
    })

    return userDeleteFromDbAndAWSResponse
  } catch (error) {
    console.log(`Error deleting account: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    )
  }
}
