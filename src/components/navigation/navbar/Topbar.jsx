import { navLinksData } from '@/app/assets/data/navbar'
import { NavLink } from '@/components'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'

const Topbar = () => {
  return (
    <ul className='flex items-center gap-5 px-3 sm:px-5'>
      {(navLinksData || []).map(data => (
        <li
          key={data.id}
          className='font-poppins-rg py-3 text-[15px] text-slate-800'
        >
          <NavLink data={data} />
        </li>
      ))}
    </ul>
  )
}

export default Topbar
