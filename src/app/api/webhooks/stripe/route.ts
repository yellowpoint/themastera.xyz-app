import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  try {
    console.log(`[Webhook] Received event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string

        console.log(
          `[Webhook] checkout.session.completed - Session ID: ${session.id}, Subscription ID: ${subscriptionId}, Metadata:`,
          session.metadata
        )

        // 如果是订阅模式
        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId)
          console.log(
            `[Webhook] checkout.session.completed - Subscription Details:`,
            subscription
          )
          console.log(
            `[Webhook] checkout.session.completed - Current Period End: ${subscription.items.data[0].current_period_end}`
          )
          // 我们需要 userId，通常存在 metadata 中
          const userId = session.metadata?.userId

          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                  subscription.items.data[0].current_period_end * 1000
                ),
              },
            })
            console.log(
              `[Webhook] User ${userId} subscription updated: ${subscriptionId}`
            )
          } else {
            console.error('[Webhook] User ID missing in session metadata')
          }
        }
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object // 使用 any 类型暂时绕过类型检查
        console.log(
          'invoice.payment_succeeded - Invoice Details:',
          JSON.stringify(invoice, null, 2)
        ) // 打印实际数据结构

        // 忽略这个错误，因为 invoice.subscription 实际存在
        // @ts-ignore
        const subscriptionId = invoice.subscription as string

        console.log(
          `[Webhook] invoice.payment_succeeded - Invoice ID: ${invoice.id}, Subscription ID: ${subscriptionId}`
        )

        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId)
          console.log(
            `[Webhook] invoice.payment_succeeded - Subscription Details:`,
            subscription
          )
          console.log(
            `[Webhook] invoice.payment_succeeded - Current Period End: ${subscription.items.data[0].current_period_end}`
          )

          // 更新订阅期限
          // 注意：如果是第一次支付，可能 checkout.session.completed 还没跑，这里可能会找不到用户
          // 所以这里使用 try-catch 或者先查询
          try {
            await prisma.user.update({
              where: { stripeSubscriptionId: subscriptionId },
              data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                  subscription.items.data[0].current_period_end * 1000
                ),
              },
            })
            console.log(
              `[Webhook] Updated user for subscription ${subscriptionId} via invoice`
            )
          } catch (e) {
            // 可能是第一次订阅，checkout.session.completed 会处理
            console.log(
              `[Webhook] Could not update user for subscription ${subscriptionId} (likely first payment):`,
              e
            )
          }
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log(
          `[Webhook] customer.subscription.updated - Subscription ID: ${subscription.id}, Status: ${subscription.status}`
        )
        console.log(
          `[Webhook] customer.subscription.updated - Current Period End: ${subscription.items.data[0].current_period_end}`
        )
        try {
          await prisma.user.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.items.data[0].current_period_end * 1000
              ),
            },
          })
        } catch (e) {
          console.log(
            `Could not update user for subscription ${subscription.id}:`,
            e
          )
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log(
          `[Webhook] customer.subscription.deleted - Subscription ID: ${subscription.id}`
        )

        try {
          // 当订阅被删除（取消）时，清除用户的订阅信息
          await prisma.user.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripePriceId: null, // 清除价格ID，表示无付费订阅
              stripeCurrentPeriodEnd: new Date(), // 设置为当前时间，立即过期
              // 保留 stripeCustomerId 以便未来重新订阅
            },
          })
          console.log(
            `[Webhook] User subscription marked as deleted/expired: ${subscription.id}`
          )
        } catch (error) {
          console.error(
            `[Webhook] Error updating user for subscription deletion:`,
            error
          )
        }
        break
      }
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`)
    return new NextResponse(`Webhook handler failed: ${error.message}`, {
      status: 500,
    })
  }

  return new NextResponse(null, { status: 200 })
}
