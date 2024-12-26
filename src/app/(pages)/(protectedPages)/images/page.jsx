import {
  AddNewImageButton,
  CategoryFilterButton,
  GetAllImages
} from '@/components'
import React from 'react'

export default async function UploadedImages() {
  return (
    <div className='min-h-custom w-full p-3 shadow-md sm:p-5'>
      <GetAllImages />
    </div>
  )
}
