'use client'

import { showErrorToast, showSuccessToast } from '@/lib/toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { set } from 'mongoose'

const VerifyEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      email: ''
    }
  })

  const [otpInputs, setOtpInputs] = useState(new Array(4).fill(''))
  const inputBoxRef = useRef([]) // All input box elem will store here as ref
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEmailProcessed, setIsEmailProcessed] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [email, setEmail] = useState('')
  const [isResendBtnClicked, setIsResendBtnClicked] = useState(false)

  const router = useRouter()

  // NOTE: Initial set the focus on the first input box
  useEffect(() => {
    if (inputBoxRef.current[0]) {
      inputBoxRef.current[0].focus()
    }
  }, [])

  // NOTE: Handle OnChange
  const handleOnChange = (e, index) => {
    const value = e.target.value

    // Check value isNaN
    if (isNaN(value)) {
      showErrorToast('Enter a valid number')
    }

    // Destructure the existing array a store in to a variable
    const newOtpArray = [...otpInputs]

    // Take only the last digit entered in each box and store it at the same index in the array as the box's position
    newOtpArray[index] = value.substring(value.length - 1)

    setOtpInputs(newOtpArray)

    // Handle the next auto focus event
    if (
      value &&
      index < otpInputs.length - 1 &&
      inputBoxRef.current[index + 1]
    ) {
      inputBoxRef.current[newOtpArray.indexOf('')].focus()
    }
  }

  // NOTE: Handle Backspace key event
  const handleKeyDown = (e, index) => {
    if (
      e.key === 'Backspace' &&
      !otpInputs[index] &&
      index > 0 &&
      inputBoxRef.current[index - 1]
    ) {
      inputBoxRef.current[index - 1].focus()
    }
  }

  // NOTE Resend time count
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [resendTimer])

  // NOTE: Handle Verify Button clicks
  const handleVerifyAccount = async e => {
    e.preventDefault()

    const otp = otpInputs.join('')

    if (otp && otp.length === 4) {
      try {
        setIsProcessing(true)

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/verify-user`,
          {
            otp
          }
        )

        if (response.status === 200 && response.data.success) {
          setOtpInputs(new Array(4).fill(''))
          inputBoxRef.current[0].focus()
          showSuccessToast(data.message)
          router.push('./login') // Redirect to login page
        } else {
          setOtpInputs(new Array(4).fill(''))
          inputBoxRef.current[0].focus()
          showErrorToast(data.message)
        }
      } catch (error) {
        console.log(`ERROR in verifying user CLIENT: ${error}`)
        setOtpInputs(new Array(4).fill(''))
        inputBoxRef.current[0].focus()
        showErrorToast('Internal Server Error. Please try again later.')
      } finally {
        setIsProcessing(false)
      }
    } else {
      setOtpInputs(new Array(4).fill(''))
      inputBoxRef.current[0].focus()

      showErrorToast('Please fill the inputs value properly')
    }
  }

  // NOTE Resend OTP
  const handleResendOtp = async () => {
    if (email) {
      try {
        setIsEmailProcessed(true)
        setOtpInputs(new Array(4).fill(''))
        inputBoxRef.current[0].focus()

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/resend-otp`,
          {
            email
          }
        )
        if (response.data.success && response.status === 200) {
          showSuccessToast(response.data.message)
        }
      } catch (error) {
        console.log(`Error in resend verification otp CLIENT: ${error}`)
        if (error.response) {
          showErrorToast(error.response.data.message)
        } else {
          showErrorToast('Internal Server Error. Please try again later.')
        }
      } finally {
        setIsEmailProcessed(false)
        setIsResendBtnClicked(false)
        setResendTimer(30)
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleVerifyAccount}
        className='mx-auto my-5 flex w-full max-w-[500px] flex-col px-3 pb-5 pt-10'
      >
        <h1 className='text-center font-poppins-rg text-[16px] text-slate-700'>
          Enter the OTP sent to your email
        </h1>

        <div className='my-5 flex w-full items-center justify-center gap-4'>
          {otpInputs.map((value, index) => {
            return (
              <input
                key={`box${index + 1}`}
                type='text'
                value={value}
                onChange={e => handleOnChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                ref={input => (inputBoxRef.current[index] = input)}
                className='text-dark-weight-500 shadow-light size-10 rounded-md border border-gray-400 bg-[#F3F6F9] text-center font-poppins-md'
              />
            )
          })}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type='button'
              disabled={resendTimer > 0}
              // onClick={handleResend}
              className={`mx-auto mb-5 w-fit rounded-md bg-pink-500/20 px-5 py-2 font-poppins-rg text-[13px] text-pink-500 hover:bg-pink-500/30 ${resendTimer > 0 ? 'cursor-not-allowed opacity-80' : 'cursor-pointer opacity-100'}`}
            >
              {isProcessing ? (
                <span className='flex items-center gap-2'>
                  <AiOutlineLoading className='animate-spin text-[20px] text-white' />
                  <span>Submitting...</span>
                </span>
              ) : resendTimer > 0 ? (
                `Resend in ${resendTimer} seconds`
              ) : (
                'Resend'
              )}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className='font-poppins-rg text-[13px] text-slate-700'>
              <DialogTitle>Resend Email Verification</DialogTitle>
              <DialogDescription className='italic'>
                Provide your register email address.
              </DialogDescription>

              <div>
                <label
                  htmlFor='resend-email'
                  className='font-poppins-rg text-[13px] text-slate-700'
                >
                  Email
                  <span className='ml-1 text-red-500'>*</span>
                </label>

                <input
                  type='email'
                  id='resend-email'
                  name='email'
                  placeholder='Enter your registered email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='mt-2 w-full rounded-md border border-gray-400 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
                />

                {isResendBtnClicked && !email && (
                  <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
                    Please enter your registered email.
                  </p>
                )}

                <button
                  type='button'
                  disabled={isEmailProcessed || resendTimer > 0}
                  onClick={() => {
                    setIsResendBtnClicked(true)
                    handleResendOtp()
                  }}
                  className={`mx-auto mt-5 w-fit rounded-md bg-pink-500/20 px-5 py-2 font-poppins-rg text-[13px] text-pink-500 hover:bg-pink-500/30 ${resendTimer > 0 ? 'cursor-not-allowed opacity-80' : 'cursor-pointer opacity-100'}`}
                >
                  {isEmailProcessed ? (
                    <span className='flex items-center gap-2'>
                      <AiOutlineLoading className='animate-spin text-[20px] text-white' />
                      <span>Submitting...</span>
                    </span>
                  ) : resendTimer > 0 ? (
                    `Resend in ${resendTimer} seconds`
                  ) : (
                    'Resend'
                  )}
                </button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <button
          type='submit'
          disabled={isProcessing}
          className={`flex items-center justify-center rounded-md bg-cyan-500 px-3 py-2 font-poppins-rg text-[15px] text-white ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isProcessing ? (
            <span className='flex items-center gap-2'>
              <AiOutlineLoading className='animate-spin text-[20px] text-white' />
              <span>Submitting...</span>
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </>
  )
}

export default VerifyEmailForm
