import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // 在这里处理支付成功的逻辑
        // 例如：更新用户数据库，赋予权限，发送邮件等
        console.log(`Payment successful for session ID: ${session.id}`);
        console.log(`Customer Email: ${session.customer_email}`);
        console.log(`Metadata:`, session.metadata);
        
        // TODO: 根据 metadata.userId 更新用户状态
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice payment succeeded: ${invoice.id}`);
        break;
      }
      // 可以根据需要添加更多事件处理
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`);
    return new NextResponse(`Webhook handler failed: ${error.message}`, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
