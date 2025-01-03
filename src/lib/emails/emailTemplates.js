// NOTE: Reset password email template
export const resetPasswordEmailTemplate = (otp, username) => {
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
         <p style="margin-bottom: 20px; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;"><i>${otp}</i></p>
         <p>This code will expires in one hour.</p>
         <p>If you did not request a password reset, please ignore this email.</p>
         <p>Thank you!</p>
     </div>
   </body>
   </html>
 `
}

export const verifyEmailTemplate = (otp, username) => {
  return `
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>E-Learning Marketplace Email Verification</title>
   </head>
   <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #333;">Your OTP Code</h2>
        </div>
        <div style="font-size: 16px; color: #333;">
            <p>Hello <strong>${username}</strong>,</p>
            <p>Your One-Time Password (OTP) is:</p>
            <p style="text-align: center; font-size: 24px; color: red; font-weight: bold; margin: 20px 0;">${otp}</p>
            <p>This code will expire within one hour.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        <div style="font-size: 16px; color: #333; margin-top: 20px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>Best regards,<br>E-Learning Marketplace Team</p>
        </div>
    </div>
   </body>
   </html>
 `
}
