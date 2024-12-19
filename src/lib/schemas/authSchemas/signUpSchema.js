import { z } from 'zod'

export const signUpSchema = z.object({
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
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(15, { message: "Password can't be more than 15 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    )
})
