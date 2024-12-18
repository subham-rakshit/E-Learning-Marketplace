'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NavLink = ({ data }) => {
  const pathname = usePathname()

  return (
    <>
      <Link
        href={data.navLink}
        className={`flex items-center gap-2 ${pathname === data.navLink ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
      >
        {data.icon}
        <span>{data.name}</span>
      </Link>

      <motion.hr
        initial={{ width: 0, border: 'none' }}
        animate={
          pathname && pathname === data.navLink
            ? {
                width: '100%',
                border: '1px solid rgb(59 130 246)'
              }
            : { width: 0, border: 'none' }
        }
        transition={{ duration: 0.3, ease: 'linear' }}
        className='w-0'
      />
    </>
  )
}

export default NavLink
