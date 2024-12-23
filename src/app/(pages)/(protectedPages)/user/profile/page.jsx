import { UserDetails, UserProfileUpdateDetails } from '@/components'
import React from 'react'

const UserProfile = () => {
  return (
    <>
      <div className='w-full'>
        <div className='flex min-h-[100px] items-center justify-center bg-banner p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-200'>
            <UserDetails />
          </h1>
        </div>

        <div className='min-h-custom-2 flex items-center justify-center'>
          <UserProfileUpdateDetails />
        </div>
      </div>
    </>
  )
}

export default UserProfile
