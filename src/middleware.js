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

  // Handle Auth Routes ----
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return nextAuthToken ? redirect('/') : NextResponse.next()
  }

  // Handle Protecting Routes ----
  if (protectingRoutes.some(route => pathname.startsWith(route))) {
    // Route: /user/dashboard
    if (pathname === '/user/dashboard') {
      if (nextAuthToken) {
        return nextAuthToken.role !== 'Subscriber'
          ? NextResponse.next()
          : redirect('/user/profile')
      }
      return redirect('/login')
    }

    // Route: /user/become-instructor (Only for role === "Subscriber")
    if (pathname === '/user/become-instructor') {
      if (nextAuthToken) {
        return nextAuthToken.role === 'Subscriber'
          ? NextResponse.next()
          : redirect('/user/profile')
      }
      return redirect('/login')
    }

    // Route: /user/instructor/course/create (only for role === "Instructor")
    if (pathname === '/user/instructor/course/create') {
      if (nextAuthToken) {
        return nextAuthToken.role === 'Instructor'
          ? NextResponse.next()
          : redirect('/user/profile')
      }
      return redirect('/login')
    }

    // Route: /user/all-users (only for role === "Admin")
    if (pathname === '/user/all-users') {
      if (nextAuthToken) {
        return nextAuthToken.role === 'Admin'
          ? NextResponse.next()
          : redirect('/user/profile')
      }
      return redirect('/login')
    }

    // Default route protection (for other protected routes)
    return nextAuthToken ? NextResponse.next() : redirect('/login')
  }

  // Allow the request to proceed if no conditions matched
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/user/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ]
}
