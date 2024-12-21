import { BecomeInstructorButton } from '@/components'
import React from 'react'
import { AiOutlineUserSwitch } from 'react-icons/ai'

const BecomeInstructor = () => {
  return (
    <>
      <div className='w-full'>
        <div className='flex min-h-[100px] items-center justify-center bg-banner p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-200'>
            Become Instructor
          </h1>
        </div>

        <div className='min-h-custom-2 flex w-full flex-col items-center justify-center px-3 sm:px-5'>
          <AiOutlineUserSwitch
            color='#000'
            className='mb-5 text-[80px] md:text-[100px]'
          />
          <h1 className='mb-3 text-center font-poppins-sb text-xl text-slate-700 md:text-2xl'>
            Setup payout to publish courses on <br />
            E-Learning platform
          </h1>

          <p className='mb-10 text-center font-poppins-rg text-[16px] text-yellow-600 md:text-[18px]'>
            E-Learning partners with Razorpay to transfer earnings to your bank
            account
          </p>

          <BecomeInstructorButton />

          <p className='mt-5 text-center font-poppins-rg text-[13px] text-slate-500'>
            You will be redirected to Razorpay to complete onboarding process.
          </p>
        </div>
      </div>
    </>
  )
}

export default BecomeInstructor
