'use client'

import React from 'react'
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
import { forgotPasswordSchema } from '@/lib/schemas/authSchemas/forgotPasswordSchema'

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })
  const router = useRouter()

  // Error handling function
  const handleErrors = data => {
    if (data.errors) {
      const errors = data.errors
      if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email.message
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
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/forgot-password`,
        {
          ...data
        }
      )

      // Check if the response status is 200 (success)
      if (response.status === 200 && response.data.success) {
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
        router.push('/reset-password')
      } else {
        // Handle cases where the response indicates failure
        handleErrors(response.data)
      }
    } catch (error) {
      // Handle errors (e.g., 400, 500 status codes)
      if (error.response) {
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
        {/* User Email */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='email'
            className={`mb-2 font-poppins-rg text-[13px] text-slate-800`}
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            name='email'
            {...register('email')}
            className='rounded-md border border-gray-400 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
            placeholder='example@example.com'
          />
          {errors && errors.email ? (
            <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
              {errors.email.message}
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

export default ForgotPasswordForm
