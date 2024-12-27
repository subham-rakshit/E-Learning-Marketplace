'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

const ImageSearchBox = ({ searchValue }) => {
  const router = useRouter()

  // Handle Search Box Submit
  const handleOnSubmit = e => {
    e.preventDefault()
    const value = e.target.search.value
    router.push(`?search=${encodeURIComponent(value)}`, undefined, {
      shallow: true
    })

    //* `?search=${encodeURIComponent(value)}` -> The new URL query string, safely encoded.
    //* undefined -> This means the path will not be changed, only the query string will.
    //* {shallow: true} -> This ensures that the page will not reload and only the URL will update.
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className='flex items-center overflow-hidden rounded-md border border-gray-500'
    >
      <input
        type='text'
        name='search'
        placeholder='Search'
        defaultValue={searchValue}
        className='rounded-md border-none px-3 py-2 font-poppins-rg text-[13px] text-gray-700 focus:outline-none focus:ring-0'
      />

      <button type='submit' className='bg-slate-600 p-2'>
        <MdSearch size={20} color='#fff' />
      </button>
    </form>
  )
}

export default ImageSearchBox
