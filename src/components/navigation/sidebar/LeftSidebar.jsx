'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { AiOutlineCarryOut, AiOutlineTeam } from 'react-icons/ai'
import { MdAccountCircle } from 'react-icons/md'
import { RiDashboard2Fill } from 'react-icons/ri'

const LeftSidebar = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  return (
    <>
      <Link href='/user/dashboard'>
        <div
          className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-3 font-poppins-rg text-[15px] sm:px-5 ${pathname === '/user/dashboard' ? 'bg-[#000]/10 text-blue-500' : 'text-slate-700'}`}
        >
          <RiDashboard2Fill size={16} />
          <span>Dashboard</span>
        </div>
      </Link>

      <Link href='/user/profile'>
        <div
          className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-3 font-poppins-rg text-[15px] sm:px-5 ${pathname === '/user/profile' ? 'bg-[#000]/10 text-blue-500' : 'text-slate-700'}`}
        >
          <MdAccountCircle size={16} />
          <span>Profile</span>
        </div>
      </Link>

      {session && status === 'authenticated' ? (
        session.user.role.includes('Instructor') ? (
          <Link href='/user/instructor/course/create'>
            <div
              className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-3 font-poppins-rg text-[15px] sm:px-5 ${pathname === '/user/instructor/course/create' ? 'bg-[#000]/10 text-blue-500' : 'text-slate-700'}`}
            >
              <AiOutlineCarryOut size={16} />
              <span>Create Courses</span>
            </div>
          </Link>
        ) : (
          <Link href='/user/become-instructor'>
            <div
              className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-3 font-poppins-rg text-[15px] sm:px-5 ${pathname === '/user/become-instructor' ? 'bg-[#000]/10 text-blue-500' : 'text-slate-700'}`}
            >
              <AiOutlineTeam size={16} />
              <span>Become Instructor</span>
            </div>
          </Link>
        )
      ) : null}
    </>
  )
}

export default LeftSidebar
