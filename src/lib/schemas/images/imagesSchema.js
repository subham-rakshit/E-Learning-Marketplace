import { z } from 'zod'

export const imagesSchema = z.object({
  userId: z
    .string()
    .min(1, { message: 'User ID is required' })
    .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid User ID format' }),
  imageS3Key: z.string().min(1, { message: 'Image S3 key is required' }),
  imageFileName: z.string().min(1, { message: 'Image file name is required' }),
  imageType: z.string().min(1, { message: 'Image type is required' }),
  imageUrl: z
    .string()
    .url({ message: 'Image URL must be a valid URL' })
    .optional()
})
