// NOTE: Reset password email template
export const resetPasswordTokenEmailTemplate = ({ token, username }) => {
  return `
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Reset password</title>
   </head>
   <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
     <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
         <h2 style="color: #333;"><strong>${username}</strong> Your Password Reset Code</h2>
         <p>You have requested to reset your password. Please use this code below to reset your password:</p>
         <p style="margin-bottom: 20px; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;"><i>${token}</i></p>
         <p>This code will expires in one hour.</p>
         <p>If you did not request a password reset, please ignore this email.</p>
         <p>Thank you!</p>
     </div>
   </body>
   </html>
 `
}
