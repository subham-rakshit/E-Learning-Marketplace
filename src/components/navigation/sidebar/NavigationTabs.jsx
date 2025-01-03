'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaLink } from 'react-icons/fa6'

const NavigationTabs = ({
  hrefLink = '',
  icon = <FaLink size={16} />,
  tabName = ''
}) => {
  const pathname = usePathname()

  return (
    <Link href={hrefLink}>
      <div
        className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-3 font-poppins-rg ${pathname === hrefLink ? 'bg-blue-500 text-white' : 'text-slate-700'}`}
      >
        {icon}
        <span className='text-[14px]'>{tabName}</span>
      </div>
    </Link>
  )
}

export default NavigationTabs
