import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { BsThreeDotsVertical } from 'react-icons/bs'

const CategoryFilterButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDotsVertical size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='cursor-pointer font-poppins-rg text-[13px] text-gray-600'>
          Image
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer font-poppins-rg text-[13px] text-gray-600'>
          Video
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer font-poppins-rg text-[13px] text-gray-600'>
          Pdf
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer font-poppins-rg text-[13px] text-gray-600'>
          Zip
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CategoryFilterButton
