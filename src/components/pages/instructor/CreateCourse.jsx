'use client'

import { CourseCreateForm } from '@/components'
import { createCourseSchema } from '@/lib/schemas/authSchemas/createCourseSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { IoSaveOutline } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import axios from 'axios'

const CreateCourse = () => {
  const { data: session, status } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: '$9.99',
      paid: 'true',
      image: ''
    },
    resolver: zodResolver(createCourseSchema)
  })
  const [extraStateObj, setExtraStateObj] = useState({
    isImageUploading: false,
    imageFile: '',
    imagePreview: '',
    uploadBtnText: 'Upload Image'
  })

  // Watch field
  const isPaidCourse = watch('paid') === 'true'

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
          setExtraStateObj(prev => ({
            ...prev,
            isImageUploading: true
          }))
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/image/upload-image`,
            {
              image: uri,
              imageFileName: imageFile.name,
              userId: session?.user?._id
            }
          )
          console.log(response)

          // TODO Set iamge file in the extraStateObj

          // TODO Set image uploading status to false
          if (response.data.success && response.status === 201) {
            setExtraStateObj(prev => ({
              ...prev,
              isImageUploading: false,
              imagePreview: URL.createObjectURL(imageFile),
              uploadBtnText: imageFile.name
            }))
          }
        } catch (error) {
          console.log(`Error while uploading image: ${error}`)
          setExtraStateObj(prev => ({
            ...prev,
            isImageUploading: false,
            imageFile: '',
            imagePreview: '',
            uploadBtnText: 'Upload Image'
          }))
          toast.error(
            error?.response?.data?.message ||
              'Error while uploading image. Please try again',
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
        }
      }, // Is the callBack function of the resized new image URI.
      'base64' // Is the output type of the resized new image.
      // minWidth, // Is the minWidth of the resized new image.
      // minHeight // Is the minHeight of the resized new image.
    )
  }

  // Form submit handler
  const onSubmit = data => {
    console.log(data)
  }

  return (
    <>
      {!session ? (
        <ClipLoader size={26} />
      ) : (
        <CourseCreateForm
          register={register}
          errors={errors}
          isPaidCourse={isPaidCourse}
          extraStateObj={extraStateObj}
          isSubmitting={isSubmitting}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
    </>
  )
}

export default CreateCourse
