import { LogoutButton, NavLink } from '@/components'
import React from 'react'

const Topbar = () => {
  return (
    <ul className='flex min-h-[60px] items-center gap-5 px-3 sm:px-5'>
      <NavLink />

      <LogoutButton />
    </ul>
  )
}

export default Topbar
