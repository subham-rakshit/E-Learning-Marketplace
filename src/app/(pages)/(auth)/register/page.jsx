import { RegisterForm } from '@/components'
import React from 'react'

const Register = () => {
  return (
    <div className='min-h-custom'>
      <div className='flex min-h-[150px] w-full items-center justify-center bg-banner px-3 py-5 sm:px-5'>
        <h1 className='font-poppins-md text-4xl text-white'>Register</h1>
      </div>

      <RegisterForm />
    </div>
  )
}

export default Register
