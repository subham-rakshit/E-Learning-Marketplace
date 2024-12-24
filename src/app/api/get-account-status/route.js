import dbConnect from '@/lib/db/dbConnection'
import { validateUser } from '@/lib/middlewares/validateUser'
import UserModel from '@/models/user/user'
import { NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

export async function POST(request) {
  await dbConnect()

  try {
    const { userId } = await request.json()

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

    // 1. Find the user in DB
    const user = await UserModel.findById(requestedUserDetails._id)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found. Please check the user ID.'
        },
        { status: 400 }
      )
    }

    if (user.stripe_seller_info) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account status already updated.'
        },
        { status: 400 }
      )
    }

    // 2. Retrieve the updated stripe account info
    const account = await stripe.accounts.retrieve(user.stripe_account_id)
    if (!account.charges_enabled) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized Stripe account.'
        },
        { status: 401 }
      )
    } else {
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          stripe_seller_info: account,
          role: ['Instructor']
        },
        { new: true }
      )

      return NextResponse.json(
        {
          success: true,
          message: 'Account status updated successfully. Please Login.'
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.log(`Error to get account status: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message:
          'Something went wrong to generating account status. Please try again.'
      },
      { status: 500 }
    )
  }
}
