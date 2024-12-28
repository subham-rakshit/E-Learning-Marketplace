import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { RiDashboard2Fill } from 'react-icons/ri'

const InstructorDashboard = async () => {
  return (
    <>
      <div className='w-full shadow-md'>
        <div className='flex min-h-[100px] items-center justify-center bg-banner p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-200'>
            Instructor Dashboard
          </h1>
        </div>
      </div>
    </>
  )
}

export default InstructorDashboard
