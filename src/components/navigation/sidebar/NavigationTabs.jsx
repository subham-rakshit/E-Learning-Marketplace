'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaLink } from 'react-icons/fa6'

const NavigationTabs = ({
  hrefLink = '',
  comparePathName = '',
  icon = <FaLink size={16} />,
  tabName = ''
}) => {
  const pathname = usePathname()

  return (
    <Link href={hrefLink}>
      <div
        className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-3 font-poppins-rg text-[15px] sm:px-5 ${pathname === comparePathName ? 'bg-[#000]/10 text-blue-500' : 'text-slate-700'}`}
      >
        {icon}
        <span>{tabName}</span>
      </div>
    </Link>
  )
}

export default NavigationTabs
