import { NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

export const deleteStripeAccount = async ({ accountId }) => {
  try {
    const deletedStripeAccount = await stripe.accounts.del(accountId)

    if (!deletedStripeAccount.deleted) {
      return NextResponse.json(
        {
          success: false,
          message: 'Error deleting stripe account.'
        },
        { status: 400 }
      )
    }

    return deleteStripeAccount
  } catch (error) {
    console.log(`Error deleting stripe account: ${error}`)
    return NextResponse.json(
      {
        success: false,
        message:
          'Something went wrong on deleteing stripe account. Please try again later.'
      },
      { status: 500 }
    )
  }
}
