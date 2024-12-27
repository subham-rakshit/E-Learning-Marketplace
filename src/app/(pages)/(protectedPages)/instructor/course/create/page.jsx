import { CreateCourse } from '@/components'
import React from 'react'

const InstructorCreateCourses = () => {
  return (
    <>
      <div className='w-full shadow-md'>
        <div className='flex min-h-[100px] items-center justify-center bg-banner p-3 sm:p-5'>
          <h1 className='font-poppins-md text-4xl text-slate-200'>
            Create Courses
          </h1>
        </div>

        <div className='min-h-custom-2 flex w-full items-center justify-center p-3 sm:p-5'>
          <CreateCourse />
        </div>
      </div>
    </>
  )
}

export default InstructorCreateCourses
