import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import {
  AddNewImageButton,
  CategoryFilterButton,
  GetAllImages
} from '@/components'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { BsEmojiAstonished, BsThreeDotsVertical } from 'react-icons/bs'
import { MdDelete, MdDownload } from 'react-icons/md'
import { getAllImages } from '@/lib/db/actions/image'

export default async function UploadedImages() {
  const session = await getServerSession(authOptions)

  let imagesList = []

  const { success, images } = await getAllImages(session.user._id)
  if (success) {
    imagesList = images
  } else {
    imagesList = []
  }

  return (
    <div className='min-h-custom w-full p-3 shadow-md sm:p-5'>
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

        <AddNewImageButton userId={session.user._id} />
      </div>

      <ul className='my-5 flex min-h-[80%] w-full flex-wrap gap-3 md:gap-5'>
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
      </ul>
    </div>
  )
}
