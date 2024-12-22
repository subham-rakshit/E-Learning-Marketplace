import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export const validateUser = async ({ request }) => {
  const userDetails = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!userDetails) {
    return NextResponse.json(
      {
        success: false,
        message: 'You are not authorized to access this page.'
      },
      { status: 401 }
    )
  }

  return userDetails
}
