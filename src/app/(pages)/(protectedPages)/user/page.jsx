import { UserDetails } from '@/components'
import React from 'react'

const UserProfile = () => {
  return (
    <div className='min-h-custom'>
      <div className='flex min-h-[150px] w-full items-center justify-center bg-banner px-3 py-5 sm:px-5'>
        <h1 className='font-poppins-md text-4xl text-white'>
          <UserDetails />
        </h1>
      </div>
    </div>
  )
}

export default UserProfile
