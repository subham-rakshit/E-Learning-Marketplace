import { navLinksData } from '@/app/assets/data/navbar'
import { NavLink } from '@/components'
import Link from 'next/link'
import React from 'react'

const Topbar = () => {
  return (
    <ul className='flex min-h-[60px] items-center gap-5 px-3 sm:px-5'>
      {(navLinksData || []).map(data => (
        <li
          key={data.id}
          className='h-full font-poppins-rg text-[15px] text-slate-800'
        >
          <NavLink data={data} />
        </li>
      ))}
    </ul>
  )
}

export default Topbar
