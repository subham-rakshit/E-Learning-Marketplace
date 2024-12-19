'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({ children, session }) {
  // The SessionProvider wraps all child components and provides access to the authentication session context.
  // This means all child components can access session data (e.g., user info, auth state) using NextAuth's context.

  return <SessionProvider session={session}>{children}</SessionProvider>
}
