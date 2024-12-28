import { FileType } from 'lucide-react'
import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploaderInfo: {
    type: Object,
    required: true
  },
  imageS3Key: {
    type: String,
    required: true
  },
  imageFileName: {
    type: String,
    required: true
  },
  imageType: {
    type: String,
    require: true
  },
  imageUrl: {
    type: String,
    require: true,
    default: ''
  }
})

const ImageModel = mongoose.models.Image || mongoose.model('Image', imageSchema)

export default ImageModel
