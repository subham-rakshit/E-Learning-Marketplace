import dbConnect from '@/lib/db/dbConnection'
import { NextResponse } from 'next/server'
import UserModel from '@/models/user/user'
import { hashPassword } from '@/utils/auth'
import { forgotPasswordSchema } from '@/lib/schemas/authSchemas/forgotPasswordSchema'
import { nanoid } from 'nanoid'
import { sendEmailConfig } from '@/lib/emails/sendEmail'
import { resetPasswordTokenEmailTemplate } from '@/lib/emails/emailTemplates'

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // Validate the incoming data by ZOD
    const result = forgotPasswordSchema.safeParse(body)
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
    const { email } = body

    // Generate a random id
    const passResetCode = nanoid(6).toUpperCase()

    // Check user exists in DB and add reset code in it
    const userExist = await UserModel.findOneAndUpdate(
      { email },
      {
        passwordResetCode: passResetCode,
        passwordResetCodeExpiry: Date.now() + 3600000 // 1hr
      }
    )

    if (!userExist) {
      return NextResponse.json(
        {
          success: false,
          message: 'User does not exist. Try with another email.'
        },
        { status: 400 }
      )
    }

    // Send Email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email]
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: resetPasswordTokenEmailTemplate({
              token: passResetCode,
              username: userExist.username
            })
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset password'
        }
      }
    }

    const emailResponse = await sendEmailConfig({
      params,
      successMsg: 'Code has been send successfully to your email.',
      errorMsg: 'Email sending failed.'
    })

    return emailResponse
  } catch (error) {
    console.log(`Verifying email for forgot password ERROR: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: 'Somthing went wrong. Please try again.'
      },
      { status: 500 }
    )
  }
}
