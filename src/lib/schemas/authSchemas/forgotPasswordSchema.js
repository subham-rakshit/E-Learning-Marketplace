import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter your email' })
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
      message: 'Please enter a valid email'
    })
})
