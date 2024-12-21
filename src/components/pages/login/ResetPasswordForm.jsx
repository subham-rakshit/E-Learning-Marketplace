'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading
} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { resetPasswordSchema } from '@/lib/schemas/authSchemas/resetPasswordSchema'

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch,
    clearErrors
  } = useForm({ resolver: zodResolver(resetPasswordSchema) })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isCodeVisible, setIsCodeVisible] = useState(false)
  const router = useRouter()

  const newPassword = watch('newPassword')
  const confirmPassword = watch('confirmPassword')

  useEffect(() => {
    if (newPassword === confirmPassword) {
      clearErrors('confirmPassword')
    }
  }, [newPassword, confirmPassword, clearErrors])

  // Error handling function
  const handleErrors = data => {
    if (data.errors) {
      const errors = data.errors
      if (errors.resetCode) {
        setError('resetCode', {
          type: 'server',
          message: errors.resetCode.message
        })
      }
      if (errors.newPassword) {
        setError('newPassword', {
          type: 'server',
          message: errors.newPassword.message
        })
      }
      if (errors.confirmPassword) {
        setError('confirmPassword', {
          type: 'server',
          message: errors.confirmPassword.message
        })
      }
    } else {
      toast.error(data.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  // Form submit handler
  const onSubmit = async data => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/reset-password`,
        {
          ...data
        }
      )

      // Check if the response status is 201 (success)
      if (response.status === 201 && response.data.success) {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })

        // Reset the form
        reset()
        router.push('/login')
      } else {
        // Handle cases where the response indicates failure
        handleErrors(response.data)
      }
    } catch (error) {
      // Handle errors (e.g., 400, 500 status codes)
      if (error.response) {
        console.log(error.response)

        handleErrors(error.response.data)
      } else {
        toast.error('Something went wrong. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto my-5 flex w-full max-w-[500px] flex-col px-3 pb-5 pt-10'
      >
        {/* User Reset Code */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='reset-code'
            className='mb-2 font-poppins-rg text-[13px] text-slate-800'
          >
            Reset Code
          </label>

          <div className='flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 pr-3'>
            <input
              id='reset-code'
              type={isCodeVisible ? 'text' : 'password'}
              name='resetCode'
              {...register('resetCode')}
              className='w-full border-0 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
              placeholder='Enter your reset code'
            />
            <button
              type='button'
              onClick={() => setIsCodeVisible(!isCodeVisible)}
            >
              {isCodeVisible ? (
                <AiOutlineEye className='text-[20px] text-slate-500' />
              ) : (
                <AiOutlineEyeInvisible className='text-[20px] text-slate-500' />
              )}
            </button>
          </div>
          {errors && errors.resetCode ? (
            <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
              {errors.resetCode.message}
            </p>
          ) : null}
        </div>

        {/* User New Password */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='new-password'
            className='mb-2 font-poppins-rg text-[13px] text-slate-800'
          >
            New Password
          </label>

          <div className='flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 pr-3'>
            <input
              id='new-password'
              type={isPasswordVisible ? 'text' : 'password'}
              name='newPassword'
              {...register('newPassword')}
              className='w-full border-0 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
              placeholder='Enter your new password'
            />
            <button
              type='button'
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <AiOutlineEye className='text-[20px] text-slate-500' />
              ) : (
                <AiOutlineEyeInvisible className='text-[20px] text-slate-500' />
              )}
            </button>
          </div>
          {errors && errors.newPassword ? (
            <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
              {errors.newPassword.message}
            </p>
          ) : null}
        </div>

        {/* User Confirm Password */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='confirm-password'
            className='mb-2 font-poppins-rg text-[13px] text-slate-800'
          >
            Confirm Password
          </label>

          <input
            id='confirm-password'
            type='password'
            name='confirmPassword'
            {...register('confirmPassword')}
            className='w-full rounded-md border border-gray-400 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
            placeholder='Enter your password'
          />

          {errors && errors.confirmPassword ? (
            <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSubmitting}
          className={`flex items-center justify-center rounded-md bg-cyan-500 px-3 py-2 font-poppins-rg text-[15px] text-white ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isSubmitting ? (
            <span className='flex items-center gap-2'>
              <AiOutlineLoading className='animate-spin text-[20px] text-white' />
              <span>Submitting...</span>
            </span>
          ) : (
            'Submit'
          )}
        </button>

        <p className='mt-2 text-center font-poppins-rg text-[13px] text-slate-800'>
          Remember your password?{' '}
          <Link
            href='/login'
            className='font-poppins-md text-[15px] text-blue-500 underline'
          >
            Login
          </Link>
        </p>
      </form>
    </>
  )
}

export default ResetPasswordForm
