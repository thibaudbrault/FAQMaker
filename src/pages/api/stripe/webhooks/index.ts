import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';

import { IPlan } from '@/types';
import prisma from 'lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = await buffer(req);
  const signature = req.headers[STRIPE_SIGNATURE_HEADER];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (error) {
    console.error(`Webhook signature verification failed.`, error.message)
    return res.status(500).json({ error: error.message });
  }

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.updated',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          const subscriptionId = session.subscription as string;
          const email = session.customer_details?.email;
          await prisma.tenant.update({
            where: { email },
            data: {
              subscriptionId,
            },
          });
          break;
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          const subscriptionCustomer = subscription.customer as string;
          let subscriptionPlan: IPlan['value'] = 'free';
          if (subscription.items.data[0].plan.amount === 1900) {
            subscriptionPlan = 'startup';
          } else if (subscription.items.data[0].plan.amount === 2900) {
            subscriptionPlan = 'enterprise';
          }
          await prisma.tenant.update({
            where: { customerId: subscriptionCustomer },
            data: {
              plan: subscriptionPlan,
            },
          });
          break;
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded':
          const payment = event.data.object as Stripe.PaymentIntent;
          const paymentCustomer = payment.customer as string;
          let paymentPlan: IPlan['value'] = 'free';
          if (payment.amount === 2900) {
            paymentPlan = 'startup';
          } else if (payment.amount === 4900) {
            paymentPlan = 'enterprise';
          }
          let isActive: boolean = false;
          if (payment.status === 'succeeded') {
            isActive = true;
          }
          await prisma.tenant.update({
            where: { customerId: paymentCustomer },
            data: {
              plan: paymentPlan,
              isActive,
            },
          });
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  return res.status(200).json({ message: 'Received' });
}
