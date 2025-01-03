'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '@/lib/schemas/authSchemas/signUpSchema'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading
} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm({ resolver: zodResolver(signUpSchema) })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  // Error handling function
  const handleErrors = data => {
    if (data.errors) {
      const errors = data.errors
      if (errors.username) {
        setError('username', {
          type: 'server',
          message: errors.username.message
        })
      } else if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email.message
        })
      } else if (errors.password) {
        setError('password', {
          type: 'server',
          message: errors.password.message
        })
      }
    } else {
      showErrorToast(data.message)
    }
  }

  // Form submit handler
  const onSubmit = async data => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/register`,
        {
          ...data
        }
      )

      // Check if the response status is 201 (success)
      if (response.status === 201 && response.data.success) {
        showSuccessToast(response.data.message)

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
        handleErrors(error.response.data)
      } else {
        showErrorToast('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto my-5 flex w-full max-w-[500px] flex-col px-3 pb-5 pt-10'
      >
        {/* User Name */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='username'
            className={`mb-2 font-poppins-rg text-[13px] text-slate-800`}
          >
            Name
          </label>
          <input
            id='username'
            type='text'
            name='username'
            {...register('username')}
            className='rounded-md border border-gray-400 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
            placeholder='Enter your full name'
          />
          {errors && errors.username ? (
            <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
              {errors.username.message}
            </p>
          ) : null}
        </div>
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
        {/* User Password */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='password'
            className={`mb-2 font-poppins-rg text-[13px] text-slate-800`}
          >
            Password
          </label>
          <div className='flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 pr-3'>
            <input
              id='password'
              type={isPasswordVisible ? 'text' : 'password'}
              name='password'
              {...register('password')}
              className='w-full border-0 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
              placeholder='Enter your password'
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
          {errors && errors.password ? (
            <p className='mt-2 font-poppins-rg text-[12px] text-red-500'>
              {errors.password.message}
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
          Already have an account?{' '}
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

export default RegisterForm
