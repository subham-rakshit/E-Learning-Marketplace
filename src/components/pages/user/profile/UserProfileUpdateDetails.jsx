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
import { updateProfileSchema } from '@/lib/schemas/user/profile/updateProfileSchema'
import { signOut } from 'next-auth/react'
import { ClipLoader } from 'react-spinners'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { MdClose, MdDelete } from 'react-icons/md'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const UserProfileUpdateDetails = ({ session }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    watch
  } = useForm({
    resolver: zodResolver(updateProfileSchema)
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isDeleteAccountProcessing, setIsDeleteAccountProcessing] =
    useState(false)
  const router = useRouter()

  // Extract user details from session and display them in dedicated fields
  useEffect(() => {
    if (session) {
      reset({
        username: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || ''
      })
    }
  }, [session, reset])

  // Watch username and email values
  const watchedUsername = watch('username')
  const watchedEmail = watch('email')
  const watchedNewPassword = watch('newPassword')

  // Handle Sign out function
  const handleSignout = async () => {
    await signOut({
      callbackUrl: '/login'
    })
  }

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
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/profile/update`,
        {
          ...data,
          userId: session.user._id
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
        // Call the logout function for update session
        handleSignout()
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

  // Handle Delete Account function
  const handleDeleteAccount = async () => {
    try {
      setIsDeleteAccountProcessing(true)
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/user/profile/delete-account`,
        {
          data: {
            userId: session.user._id
          }
        }
      )

      if (response.status === 200 && response.data.success) {
        showSuccessToast(response.data.message)

        // Call the logout function to delete the session
        handleSignout()
      }
    } catch (error) {
      console.log(`Error deleting account: ${error}`)

      showErrorToast(error.response.data.message || error.response.data.errors)
    } finally {
      setIsDeleteAccountProcessing(false)
    }
  }

  // Delete Button section
  const deleteAccountSection = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button
            type='button'
            className='text-red-600 transition-all duration-300 ease-in-out hover:font-poppins-sb'
          >
            Delete Account
          </button>
        </DialogTrigger>
        <DialogContent className='font-poppins-rg sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-[16px] text-slate-700'>
              Delete Account
            </DialogTitle>
            <DialogDescription className='text-[13px] text-slate-700'>
              {session && session.user.role === 'Admin' ? (
                <span className='font-poppins-md text-[13px] italic text-red-500'>
                  Admins are not allowed to delete their own accounts.
                </span>
              ) : (
                'Are you sure you want to delete your account? All of your data will be permanently deleted. This action cannot be undone.'
              )}
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center justify-between gap-2'>
            <DialogTrigger asChild>
              <button
                type='button'
                className={`flex items-center gap-2 rounded-sm bg-red-500/50 px-5 py-1 font-poppins-sb text-[16px] text-red-500 transition-all duration-300 ease-in-out hover:bg-red-500/100 hover:text-white`}
              >
                <MdClose />
                Cancle
              </button>
            </DialogTrigger>

            <button
              type='button'
              onClick={handleDeleteAccount}
              disabled={
                (session && session.user.role === 'Admin') ||
                isDeleteAccountProcessing
              }
              className={`flex items-center gap-2 rounded-sm border-2 border-red-500 px-5 py-1 font-poppins-sb text-[16px] text-red-500 transition-all duration-300 ease-in-out hover:bg-red-500/100 hover:text-white ${(session && session.user.role === 'Admin') || isDeleteAccountProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {isDeleteAccountProcessing ? (
                <>
                  <ClipLoader size={15} color='red' />
                  Processing...
                </>
              ) : (
                <>
                  <MdDelete />
                  Delete
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto my-5 flex w-full max-w-[500px] flex-col px-3'
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

        {/* User Role */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='user-role'
            className={`mb-2 font-poppins-rg text-[13px] text-slate-800`}
          >
            Role
          </label>
          <input
            id='user-role'
            type='text'
            name='role'
            disabled={true}
            {...register('role')}
            className='cursor-not-allowed rounded-md border border-gray-400 bg-slate-200 px-3 py-2 font-poppins-rg text-[13px] text-gray-500'
          />
        </div>

        {/* User New Password */}
        <div className='mb-5 flex flex-col'>
          <label
            htmlFor='profile-new-password'
            className={`mb-2 font-poppins-rg text-[13px] text-slate-800`}
          >
            New Password
          </label>
          <div className='flex items-center gap-2 overflow-hidden rounded-md border border-gray-400 pr-3'>
            <input
              id='profile-new-password'
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

        {/* Update Button */}
        <button
          type='submit'
          disabled={
            isSubmitting ||
            (session &&
              watchedUsername === session.user.name &&
              watchedEmail === session.user.email &&
              !watchedNewPassword)
          }
          className={`flex items-center justify-center rounded-md bg-cyan-500 px-3 py-2 font-poppins-rg text-[15px] text-white ${
            isSubmitting ||
            (session &&
              watchedUsername === session.user.name &&
              watchedEmail === session.user.email &&
              !watchedNewPassword)
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <span className='flex items-center gap-2'>
              <AiOutlineLoading className='animate-spin text-[20px] text-white' />
              <span>Updating...</span>
            </span>
          ) : (
            'Update Profile'
          )}
        </button>

        {/* Delete Account and Sign Out buttons */}
        <div className='mt-2 flex items-center justify-between gap-2 font-poppins-md text-[13px] text-red-400'>
          {deleteAccountSection()}

          <button
            type='button'
            onClick={handleSignout}
            className='text-red-600 transition-all duration-300 ease-in-out hover:font-poppins-sb'
          >
            Sign Out
          </button>
        </div>
      </form>
    </>
  )
}

export default UserProfileUpdateDetails
