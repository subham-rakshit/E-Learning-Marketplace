import axios from 'axios'

// Get All Images
export async function getAllImages(userId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/image/get-all-images?userId=${userId}`
    )
    if (response.data.success) {
      return {
        success: true,
        images: response.data.images
      }
    }
  } catch (error) {
    console.log(`Error in get-all-images action: ${error}`)
    return {
      success: false,
      images: []
    }
  }
}

// Delete Perticular Image
export async function deletePerticularImage(imageId, userId, userRole) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/image/delete-perticular-image?imageId=${imageId}&userId=${userId}&userRole=${userRole}`
    )

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message
      }
    }
  } catch (error) {
    console.log(`Error in delete-perticular-image action: ${error}`)
    return {
      success: false,
      message:
        error.response.data.message ||
        error.response.data.errors ||
        error.message ||
        'Something went wrong deleting image. Please try again.'
    }
  }
}

// Download Perticular Image
export async function downloadPerticularImage(imageId, userId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/image/download-perticular-image?imageId=${imageId}&userId=${userId}`,
      // {
      //   headers: {
      //     // 'Content-Encoding': 'binary',
      //     responseType: 'blob'
      //   }
      // }
      {
        responseType: 'arraybuffer'
      }
    )

    if (response.status === 200) {
      return {
        success: true,
        responseData: response
      }
    }
  } catch (error) {
    console.log(`Error in download-perticular-image action: ${error}`)
    return {
      success: false,
      message:
        error.response.data.message ||
        error.response.data.errors ||
        error.message ||
        'Something went wrong downloading image. Please try again.'
    }
  }
}
