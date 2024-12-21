import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

const protectingRoutes = ['/', '/user']

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

  // Handle Protecting Routes
  if (protectingRoutes.some(route => pathname.startsWith(route))) {
    return nextAuthToken ? NextResponse.next() : redirect('/login')
  }

  // Allow the request to proceed if no conditions matched
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/user/:path',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ]
}
