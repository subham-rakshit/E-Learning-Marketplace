import dbConnect from '@/lib/db/dbConnection'
import { verifyUserEmailConfig } from '@/lib/emails/sendEmail'
import { validateUser } from '@/lib/middlewares/validateUser'
import UserModel from '@/models/user/user'
import { comparePassword, hashPassword } from '@/utils/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // NextAuth token
    const requestedUserDetails = await validateUser({ request })

    // Extracting request fields from body
    const { username, email, role, newPassword, userId } = body

    // Authorization check
    if (requestedUserDetails._id !== userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Unauthorized access. You do not have permission to update this profile.'
        },
        { status: 403 }
      )
    }

    // Fetch User data based on requested user's id
    const userData = await UserModel.findOne({ _id: requestedUserDetails._id })

    // New Password validation checks
    if (newPassword) {
      if (
        newPassword.length < 8 ||
        newPassword.length > 15 ||
        !newPassword.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Password must be between 8 and 15 characters, containing uppercase, lowercase, a number, and a special character.'
          },
          { status: 400 }
        )
      }

      // Check New and Old passwords are same or not
      const isSamePassword = await comparePassword(
        newPassword,
        userData.password
      )
      if (isSamePassword) {
        return NextResponse.json(
          {
            success: false,
            message: 'New Password must be different from old password.'
          },
          { status: 400 }
        )
      }
    }

    // Duplicate email check
    if (email) {
      if (email !== requestedUserDetails.email) {
        const emailExists = await UserModel.findOne({ email })
        if (emailExists) {
          return NextResponse.json(
            {
              success: false,
              message: 'Email is already in use. Please choose a different one.'
            },
            { status: 400 }
          )
        }
      }
    }

    // Update functionalities
    const updatedUserDetails = await UserModel.findByIdAndUpdate(
      requestedUserDetails._id,
      {
        $set: {
          username,
          email,
          password: newPassword
            ? await hashPassword(newPassword)
            : userData.password
        }
      },
      { new: true }
    )

    // Verify the email in AWS
    if (requestedUserDetails.email !== email) {
      const response = await verifyUserEmailConfig({
        email,
        successMsg: 'Email verified successfully.',
        errorMsg: 'Error verifying email.'
      })

      return response
    }

    // Response
    return NextResponse.json(
      {
        success: true,
        message: 'User profile updated successfully.',
        user: updatedUserDetails
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(`Error updating user profile: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    )
  }
}
