import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const authRoutes = ['/login', '/register']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // NextAuth token
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const redirect = path => NextResponse.redirect(new URL(path, request.url))

  // Handle Auth Routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return nextAuthToken ? redirect('/') : NextResponse.next()
  }

  // Allow the request to proceed if no conditions matched
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register']
}
