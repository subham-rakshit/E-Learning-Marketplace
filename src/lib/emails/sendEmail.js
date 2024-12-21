import { NextResponse } from 'next/server'
import {
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand
} from '@aws-sdk/client-ses'

// AWS SES Config
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

// Send Regular Email Config
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

// Send Verification Email Config
export const verifyUserEmailConfig = async ({
  email,
  successMsg,
  errorMsg,
  statusCode = 201,
  successStatus = true
}) => {
  try {
    // Create the VerifyEmailIdentityCommand
    const command = new VerifyEmailIdentityCommand({
      EmailAddress: email // User's email address to verify
    })

    // Send the command using the SES Client
    const emailSend = await sesClient.send(command)

    return NextResponse.json(
      {
        success: successStatus,
        message: successMsg
      },
      { status: statusCode }
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
