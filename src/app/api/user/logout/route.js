import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/dbConnection'

export async function GET(request) {
  await dbConnect()

  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Signout successfully.'
      },
      { status: 200 }
    )

    response.cookies.set('access-token', '', {
      httpOnly: true,
      expiresIn: new Date(0), // delete cookies imediately
      maxAge: 0,
      path: '/'
    })

    return response
  } catch (error) {
    console.error(`Error logining out user: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message: 'Can not signout. Try again.'
      },
      { status: 500 }
    )
  }
}
