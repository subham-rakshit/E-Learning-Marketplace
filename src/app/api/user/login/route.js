import dbConnect from '@/lib/db/dbConnection'
import { NextResponse } from 'next/server'
import UserModel from '@/models/user/user'
import { hashPassword, comparePassword } from '@/utils/auth'
import { loginSchema } from '@/lib/schemas/authSchemas/loginSchema'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // Validate the incoming data by ZOD
    const result = loginSchema.safeParse(body)
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
    const { email, password } = body

    // Check user existence by email
    const userExist = await UserModel.findOne({ email })

    if (!userExist) {
      return NextResponse.json(
        {
          success: false,
          message: 'No user found.'
        },
        { status: 400 }
      )
    }

    // Compare the password
    const matchPassword = await comparePassword(password, userExist.password)

    if (!matchPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password does not match.'
        },
        { status: 400 }
      )
    }

    // Inject user data in response cookies
    const token = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
        role: userExist.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Exclude the password from the user data
    const { password: pass, ...rest } = userExist._doc
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successfully.',
        user: rest
      },
      { status: 200 }
    )

    // Send cookies
    response.cookies.set('access-token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Days
    })

    return response
  } catch (error) {
    console.log(`Login user ERROR: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: 'Can not logged in. Try again.'
      },
      { status: 500 }
    )
  }
}
