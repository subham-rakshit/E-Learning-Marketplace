'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { AuthNavLink } from '@/components'
import { getServerSession } from 'next-auth'
import React from 'react'

const AuthRoutesTopbar = async () => {
  const session = await getServerSession(authOptions)

  return (
    <ul className='mb-2 flex min-h-[60px] items-center gap-5 px-3 shadow-md sm:px-5'>
      <AuthNavLink session={session} />
    </ul>
  )
}

export default AuthRoutesTopbar
