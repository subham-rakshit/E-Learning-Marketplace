import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/dbConnection'
import AWS from 'aws-sdk'
import { Reply } from 'lucide-react'
import { Sub } from '@radix-ui/react-dropdown-menu'

// AWS SES Config
const awsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: process.env.AWS_API_VERSION
}

// AWS SES instance (pass the config)
const SES = new AWS.SES(awsConfig)

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

  try {
    const emailSend = await SES.sendEmail(params).promise()

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully.',
        data: emailSend
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Email sending failed.',
        data: error
      },
      { status: 500 }
    )
  }
}
