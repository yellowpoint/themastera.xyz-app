import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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
      successUrl = '/subscriptions/success',
      cancelUrl = '/subscriptions/cancel',
    } = await req.json()

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const user = session?.user

    if (!user || !user.id || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized or missing user info' },
        { status: 401 }
      )
    }

    if (mode === 'subscription' && !priceId) {
      return NextResponse.json(
        { error: 'Price ID is required for subscription mode' },
        { status: 400 }
      )
    }

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

    let customerId: string | undefined = undefined

    // 检查用户是否已经有 Stripe Customer ID
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    })

    if (dbUser?.stripeCustomerId) {
      customerId = dbUser.stripeCustomerId
    }

    const stripeSessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items,
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${cancelUrl}`,
      metadata: {
        userId: user.id,
        ...metadata,
      },
      allow_promotion_codes: true,
    }

    if (customerId) {
      stripeSessionConfig.customer = customerId
      // 如果提供了 customer，可以使用 customer_update 来更新信息，但通常不需要
    } else {
      stripeSessionConfig.customer_email = user.email
      // customer_creation is only allowed in 'payment' or 'setup' mode
      if (mode !== 'subscription') {
        stripeSessionConfig.customer_creation = 'always'
      }
    }

    if (mode === 'subscription') {
      stripeSessionConfig.subscription_data = {
        metadata: {
          userId: user.id,
          ...metadata,
        },
      }
    }

    const stripeSession =
      await stripe.checkout.sessions.create(stripeSessionConfig)

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    })
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
