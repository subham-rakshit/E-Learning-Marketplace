import React from 'react'
import { ClipLoader } from 'react-spinners'

const loading = () => {
  return (
    <div className='min-h-custom flex w-full items-center justify-center'>
      <ClipLoader size={36} />
    </div>
  )
}

export default loading
