import Link from 'next/link'
import React from 'react'
import { RiDashboard2Fill } from 'react-icons/ri'

const Dashboard = () => {
  return (
    <>
      <div className='w-full'>
        <div className='flex min-h-[100px] items-center justify-center bg-slate-300 p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-700'>
            User Dashboard
          </h1>
        </div>
      </div>
    </>
  )
}

export default Dashboard
