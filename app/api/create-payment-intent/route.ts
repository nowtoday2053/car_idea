import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set in environment variables')
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in .env.local' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { amount = 499 } = body // Default to $4.99

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $0.50' },
        { status: 400 }
      )
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        vin: body.vin || '',
        askingPrice: body.price?.toString() || '',
        email: body.email || '',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create payment intent'
    if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in .env.local'
    } else if (error.type === 'StripeAPIError') {
      errorMessage = `Stripe API error: ${error.message}`
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

