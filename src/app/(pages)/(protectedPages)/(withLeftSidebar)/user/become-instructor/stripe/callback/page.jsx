'use client'

import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const StripeCallback = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const getAccountStatus = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get-account-status`,
        {
          userId: session?.user?._id || ''
        }
      )

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || 'You can now make courses and sell.',
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          }
        )

        // Call the signOut function to update the session with stripe account id
        await signOut({
          callbackUrl: '/login'
        })
      }
    } catch (error) {
      console.log(`Stripe Callback Error: ${error}`)
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

      if (session && session.user) {
        if (session.user.role === 'Subscriber') {
          router.push('/user/become-instructor')
        } else {
          router.push('/profile')
        }
      } else {
        await signOut({
          callbackUrl: '/login'
        })
      }
    }
  }

  useEffect(() => {
    if (session && session.user && session.user.role === 'Subscriber') {
      getAccountStatus()
    }
  }, [session])

  return (
    <>
      <div className='min-h-custom flex w-full items-center justify-center bg-[#f3f3f3] shadow-md'>
        <ClipLoader size={30} />
      </div>
    </>
  )
}

export default StripeCallback
