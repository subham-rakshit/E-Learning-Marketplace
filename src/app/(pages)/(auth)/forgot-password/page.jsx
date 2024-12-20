import { ForgotPasswordForm } from '@/components'
import React from 'react'

const ForgotPassword = () => {
  return (
    <div className='min-h-custom'>
      <div className='flex min-h-[150px] w-full items-center justify-center bg-banner px-3 py-5 sm:px-5'>
        <h1 className='font-poppins-md text-4xl text-white'>Forgot Password</h1>
      </div>

      <ForgotPasswordForm />
    </div>
  )
}

export default ForgotPassword
