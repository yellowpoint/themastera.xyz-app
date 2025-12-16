import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const {
      priceId,
      quantity = 1,
      metadata = {},
      mode = 'payment',
    } = await req.json()

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const user = session?.user

    const line_items = priceId
      ? [
          {
            price: priceId,
            quantity,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Test Product',
                description: 'A test product for Stripe integration',
              },
              unit_amount: 1000, // $10.00
            },
            quantity,
          },
        ]

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/cancel`,
      customer_email: user?.email,
      metadata: {
        userId: user?.id,
        ...metadata,
      },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    })
  } catch (error) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
