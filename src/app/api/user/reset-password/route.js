import dbConnect from '@/lib/db/dbConnection'
import { resetPasswordSchema } from '@/lib/schemas/authSchemas/resetPasswordSchema'
import UserModel from '@/models/user/user'
import { comparePassword, hashPassword } from '@/utils/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // Validate the incoming data by ZOD
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
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

    // Destucture the incoming data
    const { resetCode, newPassword } = body

    // Find User by reset code
    const user = await UserModel.findOne({
      passwordResetCode: resetCode,
      passwordResetCodeExpiry: { $gt: new Date() } // handle 1hr time expiry
    })
    if (!user) {
      await UserModel.findOneAndUpdate(
        { passwordResetCode: resetCode },
        { $set: { passwordResetCode: null, passwordResetCodeExpiry: null } },
        { new: true }
      )

      return NextResponse.json(
        {
          success: false,
          message: 'Reset code is invalid or expired. Please try again.'
        },
        { status: 400 }
      )
    }

    // Check the newPassword is not the previous one
    const isNewPasswordSameAsOldPassword = await comparePassword(
      newPassword,
      user.password
    )
    if (isNewPasswordSameAsOldPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'New password cannot be the same as the old password.'
        },
        { status: 400 }
      )
    }

    // Update the Old password wth new one
    await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        password: await hashPassword(newPassword),
        passwordResetCode: null,
        passwordResetCodeExpiry: null
      },
      { new: true }
    )

    // Send the response
    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(`Reseting password ERROR: ${error}`)

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.'
      },
      { status: 500 }
    )
  }
}
