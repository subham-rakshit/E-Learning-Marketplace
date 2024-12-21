'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import { PulseLoader } from 'react-spinners'

const UserDetails = () => {
  const { data: session, status } = useSession()

  return (
    <>
      {status === 'authenticated' && session ? (
        session.user.name
      ) : (
        <PulseLoader size={8} color='#000' />
      )}
    </>
  )
}

export default UserDetails
