'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { IoLogInOutline } from 'react-icons/io5'
import { TiUserAddOutline } from 'react-icons/ti'

const NavLink = ({ session }) => {
  const pathname = usePathname()

  return (
    <>
      {/* Home - if session is present then only show Home page */}
      {session && (
        <>
          <li className={`h-full font-poppins-rg text-[15px] text-slate-800`}>
            <Link
              href='/'
              className={`flex items-center gap-2 ${pathname === '/' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
            >
              <span>App</span>
            </Link>

            <motion.hr
              initial={{ width: 0, border: 'none' }}
              animate={
                pathname && pathname === '/'
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

          {/* Become Instructor */}
          {session.user.role === 'Subscriber' && (
            <li className={`h-full font-poppins-rg text-[15px] text-slate-800`}>
              <Link
                href='/user/become-instructor'
                className={`flex items-center gap-2 ${pathname === '/user/become-instructor' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
              >
                <span>Become Instructor</span>
              </Link>

              <motion.hr
                initial={{ width: 0, border: 'none' }}
                animate={
                  pathname && pathname === '/user/become-instructor'
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
          )}

          {/* Instructor Create Course */}
          {session.user.role === 'Instructor' && (
            <li className={`h-full font-poppins-rg text-[15px] text-slate-800`}>
              <Link
                href='/instructor/course/create'
                className={`flex items-center gap-2 ${pathname === '/instructor/course/create' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
              >
                <span>Create Course</span>
              </Link>

              <motion.hr
                initial={{ width: 0, border: 'none' }}
                animate={
                  pathname && pathname === '/instructor/course/create'
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
          )}

          {/* Admin All Users */}
          {session.user.role === 'Admin' && (
            <li className={`h-full font-poppins-rg text-[15px] text-slate-800`}>
              <Link
                href='/admin/all-users'
                className={`flex items-center gap-2 ${pathname === '/admin/all-users' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
              >
                <span>Users</span>
              </Link>

              <motion.hr
                initial={{ width: 0, border: 'none' }}
                animate={
                  pathname && pathname === '/admin/all-users'
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
          )}
        </>
      )}
    </>
  )
}

export default NavLink
