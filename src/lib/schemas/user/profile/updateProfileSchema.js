import { z } from 'zod'

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(50, { message: "Name can't be more than 50 characters" }),
  email: z
    .string()
    .email({ message: 'Please enter your email' })
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
      message: 'Please enter a valid email'
    }),
  role: z.string(),
  newPassword: z.string()
})
