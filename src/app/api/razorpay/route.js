import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { nanoid } from 'nanoid'
import dbConnect from '@/lib/db/dbConnection'
import { validateUser } from '@/lib/middlewares/validateUser'
import { razorpayConfig } from '@/utils/razorpayConfig'
import UserModel from '@/models/user/user'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Check the userId
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid userId. Please provide a valid user ID.'
        },
        { status: 400 }
      )
    }

    // Validate the user using the NextAuth token (middleware)
    const requestedUserDetails = await validateUser({ request })

    // Authorization check to ensure the correct user is making the request
    if (requestedUserDetails._id !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. Permission denied.'
        },
        { status: 403 }
      )
    }

    // Check if the user exists in the database
    const userExists = await UserModel.findOne({ _id: userId })
    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            'User does not exist. Please check the user ID or register first.'
        },
        { status: 400 }
      )
    }

    // Check if the user already has a razorpay payment setup. Means user already make payment successfull for become an Instructor
    if (userExists?.paymentDetails?.razorpay_payment_id) {
      return NextResponse.json(
        {
          success: false,
          message:
            'User already has a razorpay payment setup. Contact support for help.'
        },
        { status: 400 }
      )
    }

    // Razorpay order configuration
    const amount = 100 * 100 // amount in paisa. In our case it's INR 100
    const currency = 'INR'
    const options = {
      amount: amount.toString(),
      currency,
      receipt: 'receipt_' + nanoid(),
      notes: {
        // Additional information for the transaction
        paymentFor: requestedUserDetails.username,
        userId: userId,
        userEmail: requestedUserDetails.email
      }
    }

    // Create Razorpay order using the configuration
    const orderDetails = await razorpayConfig({ options: options })

    // Return success response with the order details
    return NextResponse.json(
      {
        success: true,
        message: 'Order ID created successfully.',
        order: orderDetails
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(`Faild to generate razorpay order id: ${error}`)

    // Return a generic error response to the client
    return NextResponse.json(
      {
        success: false,
        message:
          'Something went wrong while generating the Razorpay order. Please try again later.'
      },
      { status: 500 }
    )
  }
}
