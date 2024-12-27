'use client'

import React, { useState } from 'react'
import { MdOutlineAddPhotoAlternate } from 'react-icons/md'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClipLoader } from 'react-spinners'
import Image from 'next/image'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { showErrorToast } from '@/lib/toast'

const AddNewImageButton = ({ userId }) => {
  const [imageObj, setImageObj] = useState({
    fileName: '',
    imagePreview: '',
    isPreviewBtnClicked: false,
    isImageUploading: false,
    uploadBtnText: 'Upload Image'
  })

  // Handle Image Upload function
  const handleImageUpload = e => {
    const imageFile = e.target.files[0]

    // Resize the image (react-image-file-resizer)
    Resizer.imageFileResizer(
      imageFile, // Is the file of the image which will resized.
      700, // Is the maxWidth of the resized new image.
      500, // Is the maxHeight of the resized new image.
      'JPEG', // Is the compressFormat of the resized new image.
      100, // Is the quality of the resized new image.
      0, // Is the degree of clockwise rotation to apply to uploaded image.
      async uri => {
        try {
          setImageObj(prev => ({
            ...prev,
            isImageUploading: true
          }))

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/image/upload-image`,
            {
              image: uri,
              imageFileName: imageFile.name,
              userId: userId
            }
          )

          if (response.data.success && response.status === 201) {
            setImageObj(prev => ({
              ...prev,
              isImageUploading: false,
              fileName: imageFile.name,
              imagePreview: response.data.url,
              uploadBtnText: imageFile.name
            }))
          }
        } catch (error) {
          console.log(`Error while uploading image: ${error}`)
          setImageObj(prev => ({
            ...prev,
            isImageUploading: false,
            fileName: '',
            imagePreview: '',
            uploadBtnText: 'Upload Image'
          }))

          showErrorToast(
            error?.response?.data?.message || error?.response?.data?.errors
          )
        }
      }, // Is the callBack function of the resized new image URI.
      'base64' // Is the output type of the resized new image.
      // minWidth, // Is the minWidth of the resized new image.
      // minHeight // Is the minHeight of the resized new image.
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type='button'
          className='flex w-fit items-center gap-2 rounded-sm bg-blue-500 px-5 py-2 font-poppins-rg text-[13px] text-white'
        >
          <MdOutlineAddPhotoAlternate size={15} />
          Add New
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='font-poppins-rg text-[16px] text-slate-800'>
            Upload New Image
          </DialogTitle>
          <DialogDescription className='font-poppins-rg text-[13px] text-slate-500'>
            First check if the image already exists in your gallery. Click
            Upload Image when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='my-5 flex items-center justify-between gap-2'>
          <label
            id='course-banner'
            className='group flex w-fit cursor-pointer items-center gap-2 rounded-sm bg-blue-500/80 px-5 py-[6px] font-poppins-rg text-[13px] text-white transition-all duration-300 ease-in-out hover:bg-blue-500'
          >
            {imageObj?.isImageUploading ? (
              <>
                <ClipLoader
                  size={15}
                  color='white'
                  className='group-hover:text-white'
                />
                Uploading...
              </>
            ) : imageObj?.uploadBtnText.length > 20 ? (
              imageObj.uploadBtnText.slice(0, 20) + ' ...'
            ) : (
              imageObj.uploadBtnText
            )}

            <input
              type='file'
              id='course-banner'
              name='image'
              accept='image/*'
              onChange={handleImageUpload}
              hidden
              disabled={imageObj.isImageUploading}
            />
          </label>

          {imageObj.imagePreview && (
            <button
              type='button'
              className={`group flex w-fit cursor-pointer items-center gap-2 rounded-sm px-5 py-[6px] font-poppins-rg text-[13px] transition-all duration-300 ease-in-out ${imageObj.isPreviewBtnClicked ? 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
              onClick={() =>
                setImageObj(prev => ({
                  ...prev,
                  isPreviewBtnClicked: !prev.isPreviewBtnClicked
                }))
              }
            >
              {imageObj.isPreviewBtnClicked ? 'Close' : 'Preview'}
            </button>
          )}
        </div>

        {imageObj.isPreviewBtnClicked && (
          <div className='mb-5 h-[200px] w-full rounded-md border-[2px] border-dashed border-blue-500 p-2'>
            <Image
              src={imageObj.imagePreview}
              alt={imageObj.fileName}
              width={100}
              height={100}
              style={{ width: '100%', height: '100%' }}
              className='rounded-sm'
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddNewImageButton
