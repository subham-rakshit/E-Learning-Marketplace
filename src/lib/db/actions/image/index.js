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
export async function deletePerticularImage() {}
