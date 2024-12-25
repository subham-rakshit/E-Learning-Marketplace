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
    imagePreview: ''
  })

  // Watch field
  const isPaidCourse = watch('paid') === 'true'

  // Handle Image Upload function
  const handleImageUpload = e => {
    const imageFile = e.target.files[0]
    setExtraStateObj({
      ...extraStateObj,
      imagePreview: URL.createObjectURL(imageFile)
    })
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
