import { NextResponse } from 'next/server'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// AWS SES Config
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export const sendEmailConfig = async ({ params, successMsg, errorMsg }) => {
  try {
    // Create the SendEmailCommand
    const command = new SendEmailCommand(params)

    // Send the email using SESClient
    const emailSend = await sesClient.send(command)

    return NextResponse.json(
      {
        success: true,
        message: successMsg
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: errorMsg,
        data: error
      },
      { status: 500 }
    )
  }
}
