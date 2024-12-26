import Image from 'next/image'
import React from 'react'
import { IoSaveOutline } from 'react-icons/io5'
import { ClipLoader } from 'react-spinners'

const CourseCreateForm = ({
  register,
  errors,
  isPaidCourse,
  extraStateObj,
  isSubmitting,
  handleImageUpload,
  handleSubmit,
  onSubmit
}) => {
  // Create price range options (9.99 to 99.99)
  const priceRangeOptions = []
  for (let i = 9.99; i <= 100.99; i++) {
    priceRangeOptions.push(
      <option value={`$${i.toFixed(2)}`} key={i.toFixed(2)}>
        ${i.toFixed(2)}
      </option>
    )
  }

  const commonLabelStyle = 'font-poppins-rg text-[13px] text-slate-800'
  const commonInputFieldStyle =
    'w-full rounded-md border border-gray-400 px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0 mt-2'
  const commonErrorMessageStyle =
    'mt-1 font-poppins-rg text-[12px] text-red-500'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex w-full max-w-[800px] flex-col gap-5'
    >
      {/* Course Name */}
      <div>
        <label htmlFor='course-name' className={commonLabelStyle}>
          Name
          <span className='ml-1 text-red-500'>*</span>
        </label>

        <input
          {...register('name')}
          type='text'
          id='course-name'
          placeholder='Enter course name'
          name='name'
          className={commonInputFieldStyle}
        />

        {errors?.name ? (
          <p className={commonErrorMessageStyle}>{errors.name.message}</p>
        ) : null}
      </div>

      {/* Course Category */}
      <div>
        <label htmlFor='course-category' className={commonLabelStyle}>
          Category
          <span className='ml-1 text-red-500'>*</span>
        </label>

        <input
          {...register('category')}
          type='text'
          id='course-category'
          placeholder='Enter category'
          name='category'
          className={commonInputFieldStyle}
        />

        {errors?.category ? (
          <p className={commonErrorMessageStyle}>{errors.category.message}</p>
        ) : null}
      </div>

      {/* Course Description */}
      <div>
        <label htmlFor='course-description' className={commonLabelStyle}>
          Description
          <span className='ml-1 text-red-500'>*</span>
        </label>

        <textarea
          {...register('description')}
          id='course-description'
          name='description'
          placeholder='Enter description'
          className={`${commonInputFieldStyle} min-h-[100px]`}
        ></textarea>

        {errors?.description ? (
          <p className={commonErrorMessageStyle}>
            {errors.description.message}
          </p>
        ) : null}
      </div>

      {/* Course Paid Type */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-5'>
        <label htmlFor='course-type' className={commonLabelStyle}>
          Course Type
          <span className='ml-1 text-red-500'>*</span>
        </label>

        <div>
          <div className='flex items-center gap-2'>
            <select
              {...register('paid')}
              name='paid'
              id='course-type'
              className={`${commonInputFieldStyle} min-w-[150px]`}
            >
              <option value={'true'}>Paid</option>
              <option value={'false'}>Free</option>
            </select>

            {/* Course Price */}
            {isPaidCourse && (
              <select
                {...register('price')}
                name='price'
                id='course-price'
                className={`${commonInputFieldStyle} h-10 min-w-[100px]`}
              >
                {priceRangeOptions}
              </select>
            )}
          </div>
          {errors?.price ? (
            <p className={commonErrorMessageStyle}>{errors.price.message}</p>
          ) : null}
        </div>
      </div>

      {/* Course Image */}
      <div className='flex items-center'>
        <label htmlFor='course-banner' className={commonLabelStyle}>
          Banner Image
          <span className='ml-1 text-red-500'>*</span>
        </label>

        <div className='ml-5'>
          <label
            id='course-banner'
            className='group flex w-fit cursor-pointer items-center gap-2 rounded-sm bg-blue-500/80 px-5 py-[6px] font-poppins-rg text-[13px] text-white transition-all duration-300 ease-in-out hover:bg-blue-500'
          >
            {extraStateObj?.isImageUploading ? (
              <>
                <ClipLoader
                  size={15}
                  color='white'
                  className='group-hover:text-white'
                />
                Uploading...
              </>
            ) : extraStateObj?.uploadBtnText.length > 20 ? (
              extraStateObj.uploadBtnText.slice(0, 20) + ' ...'
            ) : (
              extraStateObj.uploadBtnText
            )}

            <input
              type='file'
              id='course-banner'
              name='image'
              accept='image/*'
              onChange={e => handleImageUpload(e)}
              hidden
              disabled={extraStateObj?.isImageUploading || isSubmitting}
              className={commonInputFieldStyle}
            />
          </label>

          {errors?.image ? (
            <p className={commonErrorMessageStyle}>{errors.image.message}</p>
          ) : null}
        </div>

        {/* Image Preview */}
        {extraStateObj?.imagePreview ? (
          <div className='relative ml-auto h-[150px] w-fit overflow-hidden rounded-lg border-2 border-dashed border-red-500 p-1'>
            <Image
              src={extraStateObj?.imagePreview}
              alt='Course Banner'
              width={100}
              height={100}
              style={{ width: 'auto', height: '100%' }}
              className='rounded-sm'
            />
          </div>
        ) : null}
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isSubmitting || extraStateObj?.isImageUploading}
        className={`flex items-center justify-center rounded-md bg-cyan-500 px-5 py-2 font-poppins-rg text-[15px] text-white sm:mx-auto ${isSubmitting || extraStateObj?.isImageUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'}`}
      >
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <ClipLoader size={15} color='white' />
            <span>Saving...</span>
          </span>
        ) : (
          <span className='flex items-center gap-2'>
            <IoSaveOutline size={15} color='white' />
            <span>Save & Continue</span>
          </span>
        )}
      </button>
    </form>
  )
}

export default CourseCreateForm
