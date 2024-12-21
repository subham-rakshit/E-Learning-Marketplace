'use client'

import React, { use, useState } from 'react'
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
import { loginSchema } from '@/lib/schemas/authSchemas/loginSchema'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm({ resolver: zodResolver(loginSchema) })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  const onSubmit = async data => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.email,
        password: data.password
      })

      if (result.error) {
        toast.error(result.error || 'Error occured during login', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
      } else {
        toast.success('Login successfully.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })

        router.push('/user/profile')
      }
    } catch (error) {
      console.log('Login ERROR: ', error)
      toast.error(error.message || 'Error occured during login', {
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

        {/* User Password */}
        <div className='mb-5 flex flex-col'>
          <div className='mb-2 flex items-center justify-between gap-2 font-poppins-rg text-[13px] text-slate-800'>
            <label htmlFor='password'>Password</label>

            <Link
              href='/forgot-password'
              className='font-poppins-md text-red-400'
            >
              Forgot Password
            </Link>
          </div>
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
          Don't have an account?{' '}
          <Link
            href='/register'
            className='font-poppins-md text-[15px] text-blue-500 underline'
          >
            Register
          </Link>
        </p>
      </form>
    </>
  )
}

export default LoginForm
