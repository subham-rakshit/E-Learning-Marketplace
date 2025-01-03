import { NextResponse } from 'next/server'
import {
  DeleteIdentityCommand,
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand
} from '@aws-sdk/client-ses'
import { deleteStripeAccount } from '../stripe/stripeAccount'
import { nanoid } from 'nanoid'
import UserModel from '@/models/user/user'
import nodemailer from 'nodemailer'
import {
  resetPasswordEmailTemplate,
  verifyEmailTemplate
} from './emailTemplates'

// TODO SMTP.js *****

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
// export const verifyUserEmailConfig = async ({
//   email,
//   successMsg,
//   errorMsg,
//   statusCode = 201,
//   successStatus = true
// }) => {
//   try {
//     // Create the VerifyEmailIdentityCommand
//     const command = new VerifyEmailIdentityCommand({
//       EmailAddress: email // User's email address to verify
//     })

//     // Send the command using the SES Client
//     const emailSend = await sesClient.send(command)

//     return NextResponse.json(
//       {
//         success: successStatus,
//         message: successMsg
//       },
//       { status: statusCode }
//     )
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: errorMsg,
//         data: error
//       },
//       { status: 500 }
//     )
//   }
// }

export const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })

  return transporter
}

export const generateOtp = num => {
  return `${nanoid(num)}`
}

export const sendEmail = async ({ email, emailType, username, userId }) => {
  try {
    const otp = generateOtp(4)

    if (emailType === 'VERIFY' || emailType === 'RESEND') {
      await UserModel.findByIdAndUpdate(userId, {
        email_verification_code: otp,
        email_verification_code_expiry: Date.now() + 3600000 // 1 hr
      })
    } else if (emailType === 'RESET') {
      await UserModel.findByIdAndUpdate(userId, {
        password_reset_code: otp,
        password_reset_code_expiry: Date.now() + 3600000 // 1 hr
      })
    }

    // Mail options
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject:
        emailType === 'VERIFY' || emailType === 'RESEND'
          ? 'E-Learning Marketplace Email Verification Code'
          : 'E-Learning Marketplace Password Reset Code',
      html:
        emailType === 'VERIFY' || emailType === 'RESEND'
          ? verifyEmailTemplate(otp, username)
          : resetPasswordEmailTemplate(otp, username)
    }

    // Send the email
    const transporter = mailTransporter()
    await transporter.sendMail(mailOptions)

    return {
      success: true,
      message:
        'Registration successful. Please check your email to verify your account.'
    }
  } catch (error) {
    console.log(`${emailType} email sending ERROR: ${error}`)
    return {
      success: false,
      message: `Something went wrong. Email sending failed. Please try again.`
    }
  }
}

// Delete User Email Verification (SES)
export const deleteUserEmailConfig = async ({
  email,
  successMsg,
  errorMsg,
  accountId
}) => {
  try {
    // Create the DeleteIdentityCommand to remove the email identity
    const command = new DeleteIdentityCommand({
      Identity: email // User's email address to delete from SES
    })

    // Send the command using the SES Client
    const emailSend = await sesClient.send(command)

    // Also delete the account from stripe if user is an Instructor
    if (accountId) {
      const stripeAccountDelete = await deleteStripeAccount({
        accountId
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: successMsg
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      `Error deleting user identity in AWS or stripe account ${error}`
    )
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
