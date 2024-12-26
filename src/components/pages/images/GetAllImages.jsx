'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { BsThreeDotsVertical } from 'react-icons/bs'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MdDelete, MdDownload } from 'react-icons/md'
import { BsEmojiAstonished } from 'react-icons/bs'
import { AddNewImageButton, CategoryFilterButton } from '@/components'
import { toast } from 'react-toastify'

const GetAllImages = () => {
  const { data: session, status } = useSession()

  const [imagesList, setImagesList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isImageUploaded, setIsImageUploaded] = useState(false)

  // Handle to get all images
  const getAllImages = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/image/get-all-images`
      )

      if (response.data.success) {
        setImagesList(response.data.images)
      }
    } catch (error) {
      console.log(`Error in getAllImages action: ${error}`)
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors ||
          'Something went wrong. Please try again.',
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
      setImagesList([])
    } finally {
      setIsLoading(false)
      setIsImageUploaded(false)
    }
  }

  useEffect(() => {
    if ((session && session.user) || isImageUploaded) {
      getAllImages()
    }
  }, [session, isImageUploaded])

  return (
    <>
      {!session ? (
        <>
          <div className='min-h-custom flex w-full items-center justify-center'>
            <ClipLoader size={26} />
          </div>
        </>
      ) : (
        <>
          <div className='flex w-full items-center justify-between gap-2'>
            <div className='flex items-center gap-1'>
              <form>
                <input
                  type='text'
                  placeholder='Search'
                  className='rounded-md border border-gray-400 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
                />
              </form>

              <CategoryFilterButton />
            </div>

            <AddNewImageButton setIsImageUploaded={setIsImageUploaded} />
          </div>

          <ul className='my-5 flex min-h-[80%] w-full flex-wrap gap-3 md:gap-5'>
            {isLoading ? (
              <div className='flex w-full items-center justify-center'>
                <ClipLoader size={26} />
              </div>
            ) : (
              <>
                {imagesList.length > 0 ? (
                  imagesList.map(image => (
                    <li
                      key={image._id}
                      className='flex h-[200px] w-full max-w-[220px] flex-col overflow-hidden rounded-md transition-all duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-md'
                    >
                      <div className='h-[140px] w-full'>
                        <Image
                          src={image.imageUrl}
                          alt={image.imageFileName}
                          width={100}
                          height={100}
                          priority={true}
                          style={{ width: '100%', height: '100%' }}
                          className='bg-cover bg-center'
                        />
                      </div>
                      <div className='flex h-[60px] items-center justify-between bg-slate-200 px-2'>
                        <p className='font-poppins-rg text-[13px] text-slate-500'>
                          File Name:{' '}
                          <span className='font-poppins-md text-slate-800'>
                            {image.imageFileName.slice(0, 10)}
                          </span>
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <BsThreeDotsVertical size={15} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='font-poppins-rg'>
                            <DropdownMenuItem>
                              <button
                                type='button'
                                className='flex w-full cursor-pointer items-center gap-2 text-[13px] text-red-500'
                              >
                                <MdDelete size={15} />
                                Delete
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-[13px] text-blue-500'>
                              <button
                                type='button'
                                className='flex w-full cursor-pointer items-center gap-2 text-[13px] text-blue-500'
                              >
                                <MdDownload size={15} />
                                Download
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className='flex w-full flex-col items-center justify-center gap-5 font-poppins-rg text-slate-500'>
                    <BsEmojiAstonished size={100} />
                    <h1 className='text-center text-[22px] text-slate-700'>
                      No Images Uploaded Yet
                    </h1>
                    <p className='text-center text-[16px] italic text-slate-500'>
                      Upload your first image to get started.
                      <br /> Please click the Add New button.
                    </p>
                  </div>
                )}
              </>
            )}
          </ul>
        </>
      )}
    </>
  )
}

export default GetAllImages
