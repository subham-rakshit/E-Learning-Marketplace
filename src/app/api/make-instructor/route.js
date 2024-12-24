import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'
import { validateUser } from '@/lib/middlewares/validateUser'
import dbConnect from '@/lib/db/dbConnection'
import UserModel from '@/models/user/user'
import queryString from 'query-string'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()
    const { userId } = body

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

    // 1. Find User from DB
    let user = await UserModel.findById(requestedUserDetails._id)

    // 2. If user doesn't have stipe_account_id yet, then create a new
    if (!user.stripeAccountId) {
      // Create stripe account and get account id
      const account = await stripe.accounts.create({
        type: 'express'
      })

      // Update user with stripe account id
      user.stripe_account_id = account.id
      await user.save()
    }

    // 3. Create account link based on account_id (for frontend to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: 'account_onboarding'
    })

    if (!accountLink.url) {
      return NextResponse.json(
        {
          success: false,
          message: 'Something went wrong to create stripe account link.'
        },
        { status: 500 }
      )
    }

    // 4. Pre fill any info such as email (optional), then send url response to frontend
    accountLink = Object.assign(accountLink, {
      'stripe_user[email]': user.email
    })

    // 5. Send the account link as response to frontend
    return NextResponse.json(
      {
        success: true,
        redirectUrl: `${accountLink.url}?${queryString.stringify(accountLink)}`
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(`Error stripe onboarding process: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message:
          'Something went wrong on stripe onboarding process. Please try again later.'
      },
      { status: 500 }
    )
  }
}
