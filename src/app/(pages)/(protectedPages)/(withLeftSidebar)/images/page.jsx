import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import {
  AddNewImageButton,
  GetAllImages,
  ImageSearchBox,
  IndividualImageOptionsBtn
} from '@/components'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import React from 'react'

import { BsEmojiAstonished } from 'react-icons/bs'
import { getAllImages } from '@/lib/db/actions/image/imageActions'
import { MdSearch } from 'react-icons/md'

export default async function UploadedImages({ searchParams }) {
  const session = await getServerSession(authOptions)

  let imagesList = []
  const { search } = await searchParams

  const { success, images } = await getAllImages(session.user._id, search || '')
  if (success) {
    imagesList = images
  } else {
    imagesList = []
  }

  return (
    <div className='min-h-custom w-full p-3 shadow-md sm:p-5'>
      <div className='flex w-full items-center justify-between gap-2'>
        <div className='flex items-center gap-1'>
          <ImageSearchBox searchValue={search} />
        </div>

        <AddNewImageButton userId={session.user._id} />
      </div>

      <ul className='my-5 flex min-h-[80%] w-full flex-wrap gap-3 md:gap-5'>
        {imagesList.length > 0 ? (
          imagesList.map(image => (
            <li
              key={image._id}
              className='flex h-[200px] w-full max-w-[220px] flex-col overflow-hidden rounded-md shadow-lg transition-all duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-sm'
            >
              <div
                className={`${session && session.user.role === 'Admin' ? 'h-[130px]' : 'h-[140px]'} w-full`}
              >
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
              <div
                className={`flex ${session && session.user.role === 'Admin' ? 'h-[70px]' : 'h-[60px]'} items-center justify-between bg-slate-200 px-2 py-1`}
              >
                <div>
                  <p className='font-poppins-rg text-[13px] text-slate-500'>
                    File Name:{' '}
                    <span className='font-poppins-md text-slate-800'>
                      {image.imageFileName.slice(0, 10)}
                    </span>
                  </p>
                  {session && session.user.role === 'Admin' && (
                    <>
                      <p className='font-poppins-rg text-[13px] text-slate-500'>
                        Name:{' '}
                        <span className='font-poppins-md text-slate-600'>
                          {image.uploaderInfo.name}
                        </span>
                      </p>

                      <p className='font-poppins-rg text-[13px] text-slate-500'>
                        Role:{' '}
                        <span className='font-poppins-md text-slate-600'>
                          {image.uploaderInfo.role}
                        </span>
                      </p>
                    </>
                  )}
                </div>
                <IndividualImageOptionsBtn
                  imageId={image._id}
                  userId={session.user._id}
                  userRole={session.user.role}
                />
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
