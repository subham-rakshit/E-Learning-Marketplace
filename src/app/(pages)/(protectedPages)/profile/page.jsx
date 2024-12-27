import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { UserDetails, UserProfileUpdateDetails } from '@/components'
import { getServerSession } from 'next-auth'
import React from 'react'

const UserProfile = async () => {
  const session = await getServerSession(authOptions)

  return (
    <>
      <div className='w-full'>
        <div className='flex min-h-[100px] items-center justify-center bg-banner p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-200'>
            {session ? (
              session.user.name
            ) : (
              <PulseLoader size={8} color='#000' />
            )}
          </h1>
        </div>

        <div className='min-h-custom-2 flex items-center justify-center'>
          <UserProfileUpdateDetails session={session} />
        </div>
      </div>
    </>
  )
}

export default UserProfile
