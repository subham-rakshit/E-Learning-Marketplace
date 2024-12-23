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

  // Handle payment with razorpay
  const makePayment = async () => {
    try {
      setIsProcessing(true)
      // Get razorpay order Id
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/razorpay?userId=${session?.user?._id || ''}`
      )

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        name: response?.data?.order?.notes?.paymentFor || '',
        currency: response?.data?.order?.currency || '',
        amount: response?.data?.order?.amount || '',
        order_id: response?.data?.order?.id || '',
        description: `Payment for ${response?.data?.order?.notes?.paymentFor || 'Service'}`,
        // Handle verify payment and update user details function
        handler: async function (response) {
          try {
            setIsProcessing(true)
            const verifyResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/razorpay/payment-verify`,
              {
                razorpay_payment_id: response?.razorpay_payment_id || '',
                razorpay_order_id: response?.razorpay_order_id || '',
                razorpay_signature: response?.razorpay_signature || '',
                userId: session?.user?._id || ''
              }
            )

            const responseData = verifyResponse.data

            if (responseData?.success) {
              toast.success(
                responseData?.message ||
                  'Payment verified successfully. Please login to continue.',
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

              await signOut({
                callbackUrl: '/login'
              })
            }
          } catch (error) {
            console.log(`Failed to verify payment: ${error}`)
            toast.error(
              error?.response?.data?.message ||
                'Payment verification failed. Please try again.',
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
          } finally {
            setIsProcessing(false)
          }
        },
        prefill: {
          name: response?.data?.order?.notes?.paymentFor || '',
          email: response?.data?.order?.notes?.userEmail || ''
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()

      paymentObject.on('payment.failed', function (response) {
        console.error('Payment Failed:', response)
        toast.error('Payment failed. Please try again or contact support.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      })
    } catch (error) {
      console.log(`Error to get razorpay order id: ${error}`)
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
          onClick={makePayment}
          disabled={isProcessing}
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
