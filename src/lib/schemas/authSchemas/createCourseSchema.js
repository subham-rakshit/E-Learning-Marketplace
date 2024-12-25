import { z } from 'zod'

export const createCourseSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Course name must be at least 3 characters' }),
    category: z
      .string()
      .min(3, { message: 'Course name must be at least 3 characters' }),
    description: z.string().min(50, {
      message: 'Course description must be at least 50 characters'
    }),
    paid: z.string().refine(value => ['true', 'false'].includes(value), {
      message: 'Invalid course type'
    }),
    price: z.string().optional(),
    image: z.string().url({ message: 'Invalid image URL format' })
  })
  .strict() // This will ensure only the fields defined in the schema are accepted
  .superRefine((data, ctx) => {
    // Check if 'paid' is 'true' and 'price' is not provided
    if (data.paid === 'true' && !data.price) {
      ctx.addIssue({
        message: 'Price is required for paid courses. Please select one price.',
        path: ['price']
      })
    }
  })
