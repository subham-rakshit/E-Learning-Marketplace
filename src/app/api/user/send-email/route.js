import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/dbConnection'
import { sendEmailConfig } from '@/lib/emails/sendEmail'

export async function GET(request) {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ['subham.rakshit199@gmail.com']
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
           <html>
            <h1>Reset password link</h1>
            <p>Click the link below to reset your password</p>
           </html>
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Reset password link'
      }
    }
  }

  const emailResponse = await sendEmailConfig({
    params,
    successMsg: 'Email send successfully.',
    errorMsg: 'Email sending failed.'
  })

  return emailResponse
}
