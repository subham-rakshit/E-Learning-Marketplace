import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export const razorpayConfig = async ({ options }) => {
  try {
    // Check Razorpay configure ID and Secret
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: 'Razorpay credentials are not configured.'
        },
        { status: 500 }
      )
    }

    // Create Razorpay Instance
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    // Create order details
    const order = await instance.orders.create(options)

    // Return order details
    return order
  } catch (error) {
    console.log(`Error to get razorpay config: ${error}`)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create Razorpay order. Please try again later.'
      },
      { status: 500 }
    )
  }
}

export const generateSignature = ({ paymentId, orderId, secretKey }) => {
  // Importing the built-in 'crypto' module from Node.js
  const crypto = require('crypto')

  // Create a HMAC (Hash-based Message Authentication Code) instance using SHA-256 as the hashing algorithm
  // 'secretKey' is the secret key that Razorpay provides, used to generate the signature
  const hash = crypto.createHmac('sha256', secretKey)

  // Update the HMAC instance with the data you want to hash.
  // This should be the concatenation of 'orderId' and 'paymentId', separated by a pipe ('|') as per Razorpay's documentation
  hash.update(orderId + '|' + paymentId)

  // Generate the final hash (signature) and return it as a hexadecimal string
  // This will be used to verify the payment authenticity
  return hash.digest('hex')
}
