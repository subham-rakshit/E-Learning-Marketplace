'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { IoLogInOutline } from 'react-icons/io5'
import { TiUserAddOutline } from 'react-icons/ti'

const AuthNavLink = ({ session }) => {
  const pathname = usePathname()

  return (
    <>
      {!session && (
        <>
          {/* Login */}
          <li className={`h-full font-poppins-rg text-[15px] text-slate-800`}>
            <Link
              href='/login'
              className={`flex items-center gap-2 ${pathname === '/login' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
            >
              <IoLogInOutline size={16} />
              <span>Login</span>
            </Link>

            <motion.hr
              initial={{ width: 0, border: 'none' }}
              animate={
                pathname && pathname === '/login'
                  ? {
                      width: '100%',
                      border: '1px solid rgb(59 130 246)'
                    }
                  : { width: 0, border: 'none' }
              }
              transition={{ duration: 0.3, ease: 'linear' }}
              className='w-0'
            />
          </li>

          {/* Register */}
          <li className={`h-full font-poppins-rg text-[15px] text-slate-800`}>
            <Link
              href='/register'
              className={`flex items-center gap-2 ${pathname === '/register' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
            >
              <TiUserAddOutline size={16} />
              <span>Register</span>
            </Link>

            <motion.hr
              initial={{ width: 0, border: 'none' }}
              animate={
                pathname && pathname === '/register'
                  ? {
                      width: '100%',
                      border: '1px solid rgb(59 130 246)'
                    }
                  : { width: 0, border: 'none' }
              }
              transition={{ duration: 0.3, ease: 'linear' }}
              className='w-0'
            />
          </li>
        </>
      )}
    </>
  )
}

export default AuthNavLink
