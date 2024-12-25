'use client'

import React from 'react'
import { IoLogOutOutline } from 'react-icons/io5'
import { RiDashboard2Fill } from 'react-icons/ri'
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { MdAccountCircle, MdDashboardCustomize } from 'react-icons/md'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const Dropdown = () => {
  const { data: session } = useSession()
  const pathname = usePathname()

  const onLogout = async () => {
    await signOut({
      callbackUrl: '/login'
    })
  }

  if (session) {
    return (
      <li className='ml-auto flex items-center gap-5'>
        {/* Become Instructor */}
        {session.user.role === 'Instructor' && (
          <div
            className={`ml-auto h-full font-poppins-rg text-[15px] text-slate-800`}
          >
            <Link
              href='/instructor/dashboard'
              className={`flex items-center gap-2 ${pathname === '/instructor/dashboard' ? 'text-blue-500' : ''} py-3 transition-all duration-300 ease-in-out`}
            >
              <span>Instructor</span>
            </Link>

            <motion.hr
              initial={{ width: 0, border: 'none' }}
              animate={
                pathname && pathname === '/instructor/dashboard'
                  ? {
                      width: '100%',
                      border: '1px solid rgb(59 130 246)'
                    }
                  : { width: 0, border: 'none' }
              }
              transition={{ duration: 0.3, ease: 'linear' }}
              className='w-0'
            />
          </div>
        )}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={session ? session.user.image : ''}
                alt={session ? session.user.name : ''}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel className='flex flex-col font-poppins-rg text-[13px] text-slate-800'>
              <span>{session ? session.user.name : ''}</span>
              <span className='text-[11px] text-slate-500'>
                {session ? session.user.email : ''}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {session && session.user.role.includes('Subscriber') ? (
              <>
                <Link href='/user/dashboard'>
                  <DropdownMenuItem className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'>
                    <RiDashboard2Fill size={16} />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>

                <Link href='/profile'>
                  <DropdownMenuItem className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'>
                    <MdAccountCircle size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
              </>
            ) : session && session.user.role.includes('Instructor') ? (
              <>
                <Link href='/profile'>
                  <DropdownMenuItem className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'>
                    <MdAccountCircle size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
              </>
            ) : session && session.user.role.includes('Admin') ? (
              <>
                <Link href='/admin/dashboard'>
                  <DropdownMenuItem className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'>
                    <RiDashboard2Fill size={16} />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>

                <Link href='/profile'>
                  <DropdownMenuItem className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'>
                    <MdAccountCircle size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
              </>
            ) : null}

            <DropdownMenuItem
              className='flex h-full cursor-pointer items-center gap-3 font-poppins-rg text-[15px] text-slate-700'
              onClick={onLogout}
            >
              <IoLogOutOutline size={16} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    )
  } else {
    return null
  }
}

export default Dropdown
