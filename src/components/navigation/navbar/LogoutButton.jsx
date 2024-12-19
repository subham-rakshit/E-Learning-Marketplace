'use client'

import React from 'react'
import { IoLogOutOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { signOut, useSession } from 'next-auth/react'

const LogoutButton = () => {
  const { data: session } = useSession()

  const onLogout = () => {
    signOut({
      callbackUrl: '/login'
    })
  }

  if (session) {
    return (
      <button
        type='button'
        onClick={onLogout}
        className='ml-auto flex h-full items-center gap-2 font-poppins-rg text-[15px] text-slate-800'
      >
        <IoLogOutOutline size={16} />
        <span>Logout</span>
      </button>
    )
  } else {
    return null
  }
}

export default LogoutButton
