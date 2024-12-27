'use client'

import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { MdDelete, MdDownload } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { deletePerticularImage } from '@/lib/db/actions/image/imageActions'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'

const IndividualImageOptionsBtn = ({ imageId, userId, userRole }) => {
  const router = useRouter()

  // Handle Image Delete function
  const handleImageDelete = async () => {
    const response = await deletePerticularImage(imageId, userId, userRole)
    console.log(response)

    if (response.success) {
      showSuccessToast(response.message)
      router.refresh() // Re-fetching the images list from DB in parent
    } else {
      showErrorToast(response.message)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDotsVertical size={15} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='font-poppins-rg'>
        <DropdownMenuItem>
          <button
            type='button'
            onClick={handleImageDelete}
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
  )
}

export default IndividualImageOptionsBtn
