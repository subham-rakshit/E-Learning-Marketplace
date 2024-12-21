import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    resetCode: z
      .string()
      .min(6, { message: 'Code must be at least 6 characters' })
      .max(6, { message: "Code can't be more than 6 characters" }),
    newPassword: z
      .string()
      .min(8, { message: 'New Password must be at least 8 characters' })
      .max(15, { message: "New Password can't be more than 15 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
        {
          message:
            'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
      ),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters' })
      .max(15, { message: "Confirm Password can't be more than 15 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
        {
          message:
            'Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
      )
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "New Password doesn't match with Confirm Password"
      })
    }
  })
