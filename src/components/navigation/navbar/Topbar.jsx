import { Dropdown, NavLink } from '@/components'
import React from 'react'

const Topbar = async () => {
  return (
    <ul className='mb-2 flex min-h-[60px] items-center gap-5 px-3 shadow-md sm:px-5'>
      <NavLink />

      <Dropdown />
    </ul>
  )
}

export default Topbar
