import dbConnect from '@/lib/db/dbConnection'
import UserModel from '@/models/user/user'
import { generateSignature } from '@/utils/razorpayConfig'
import { NextResponse } from 'next/server'

export async function POST(request) {
  await dbConnect()

  const body = await request.json()
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } =
    body

  // Validate required fields
  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature ||
    !userId
  ) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing required fields for payment verification.'
      },
      { status: 400 }
    )
  }

  // Get Razorpay secret key from environment variables
  const secretKey = process.env.RAZORPAY_KEY_SECRET || ''
  if (!secretKey) {
    return NextResponse.json(
      {
        success: false,
        message: 'Razorpay secret key is not configured.'
      },
      { status: 500 }
    )
  }

  try {
    // Generate the signature for verification
    const generatedSignature = generateSignature({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      secretKey
    })

    // Compare generated signature with the one received
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed. Please try again.'
        },
        { status: 400 }
      )
    }

    // Update the user record with new role and payment details
    const existUser = await UserModel.findById(userId)

    // Check if the user update was successful
    if (!existUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found or update failed.'
        },
        { status: 404 }
      )
    }

    // Update the user record with new role and payment details
    const updatedUser = await UserModel.findByIdAndUpdate(
      existUser._id,
      {
        role: ['Instructor'],
        paymentDetails: {
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_signature: razorpay_signature
        }
      },
      { new: true }
    )

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully. Please login to continue.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error during payment verification:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during payment verification.'
      },
      { status: 500 }
    )
  }
}
