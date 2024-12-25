import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]
const commonProtectedRoutes = ['/', '/profile']
const userProtectedRoutes = '/user'
const instructorProtectedRoutes = '/instructor'
const adminProtectedRoutes = '/admin'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // NextAuth token
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  const redirect = path => NextResponse.redirect(new URL(path, request.url))

  // Handle Auth Routes ----
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return nextAuthToken ? redirect('/profile') : NextResponse.next()
  }

  // Handle Common Protected Routes ----
  if (commonProtectedRoutes.some(route => pathname === route)) {
    return nextAuthToken ? NextResponse.next() : redirect('/login')
  }

  // Handle User Protected Routes ----
  if (pathname.startsWith(userProtectedRoutes)) {
    return nextAuthToken
      ? nextAuthToken.role === 'Subscriber'
        ? NextResponse.next()
        : redirect('/profile')
      : redirect('/login')
  }

  // Handle Instructor Protected Routes ----
  if (pathname.startsWith(instructorProtectedRoutes)) {
    return nextAuthToken
      ? nextAuthToken.role === 'Instructor'
        ? NextResponse.next()
        : redirect('/profile')
      : redirect('/login')
  }

  // Handle Admin Protected Routes ----
  if (pathname.startsWith(adminProtectedRoutes)) {
    return nextAuthToken
      ? nextAuthToken.role === 'Admin'
        ? NextResponse.next()
        : redirect('/profile')
      : redirect('/login')
  }

  // Allow the request to proceed if no conditions matched
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/user/:path*',
    '/instructor/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ]
}
