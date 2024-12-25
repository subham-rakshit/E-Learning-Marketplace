'use client'

import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SiRazorpay } from 'react-icons/si'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const BecomeInstructorButton = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter()

  // Handle payout setup with stripe
  const becomeInstructor = async () => {
    try {
      setIsProcessing(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/make-instructor`,
        {
          userId: session?.user?._id || ''
        }
      )

      if (response?.data?.success && response?.status === 201) {
        router.push(response.data.redirectUrl)
      }
    } catch (error) {
      console.log(`Error stripe onboarding: ${error}`)
      toast.error(error?.response?.data?.message || 'Something went wrong.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {!session && status === 'loading' ? (
        <ClipLoader size={16} />
      ) : (
        <button
          type='button'
          onClick={becomeInstructor}
          disabled={
            isProcessing ||
            (session &&
              session.user &&
              session.user.role.includes('Instructor'))
          }
          className={`flex w-full max-w-[300px] items-center justify-center gap-5 rounded-full bg-[#007bff] px-5 py-2 font-poppins-rg text-[15px] text-slate-200 ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
        >
          {isProcessing ? (
            <>
              <ClipLoader size={15} color='#fff' />
              Processing...
            </>
          ) : (
            <>
              <SiRazorpay size={15} color='#fff' />
              Payout Setup
            </>
          )}
        </button>
      )}
    </>
  )
}

export default BecomeInstructorButton
