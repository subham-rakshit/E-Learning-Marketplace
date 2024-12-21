import { UserDetails } from '@/components'
import React from 'react'

const UserProfile = () => {
  return (
    <>
      <div className='w-full'>
        <div className='flex min-h-[100px] items-center justify-center bg-slate-300 p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-700'>
            <UserDetails />
          </h1>
        </div>
      </div>
    </>
  )
}

export default UserProfile
