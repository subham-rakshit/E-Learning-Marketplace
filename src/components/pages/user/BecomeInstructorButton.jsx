'use client'

import React from 'react'
import { SiRazorpay } from 'react-icons/si'

const BecomeInstructorButton = () => {
  const handleBecomeInstructor = () => {
    console.log('Become Instructor')
  }

  return (
    <button
      type='button'
      onClick={handleBecomeInstructor}
      className='flex w-full max-w-[300px] items-center justify-center gap-5 rounded-full bg-[#007bff] px-5 py-2 font-poppins-rg text-[15px] text-slate-200'
    >
      <SiRazorpay size={15} color='#fff' />
      Payout Setup
    </button>
  )
}

export default BecomeInstructorButton
