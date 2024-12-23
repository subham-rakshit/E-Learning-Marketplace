import dbConnect from '@/lib/db/dbConnection'
import { signUpSchema } from '@/lib/schemas/authSchemas/signUpSchema'
import { NextResponse } from 'next/server'
import UserModel from '@/models/user/user'
import { hashPassword } from '@/utils/auth'
import { verifyUserEmailConfig } from '@/lib/emails/sendEmail'

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // Validate the incoming data by ZOD
    const result = signUpSchema.safeParse(body)
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
    const { username, email, password } = body

    // Check duplicate email
    const userExist = await UserModel.findOne({ email })

    if (userExist) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already exists. Try with another email.'
        },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Register the new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword
    })

    await newUser.save()

    // Trigger verification email
    const verificationEmailResponse = await verifyUserEmailConfig({
      email,
      successMsg: `User created successfully. Please login.`,
      errorMsg:
        'Somthing went wrong. Verification email sending failed. Please try again.'
    })

    return verificationEmailResponse
  } catch (error) {
    console.log(`Creating new user ERROR: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: 'Can not create the new user. Try again.'
      },
      { status: 500 }
    )
  }
}
