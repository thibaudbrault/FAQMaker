import { NextApiRequest, NextApiResponse } from 'next';
import type { Stripe } from 'stripe';
import getRawBody from 'raw-body';
import prisma from 'lib/prisma';
import { IPlan } from '@/types';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
  const body = await getRawBody(req);
  const signature = req.headers[STRIPE_SIGNATURE_HEADER];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          const subscriptionId = session.subscription as string;
          const email = session.customer_details.email;
          await prisma.tenant.update({
            where: { email },
            data: {
              subscriptionId,
            },
          });
          break;
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent;
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded':
          const payment = event.data.object as Stripe.PaymentIntent;
          const customerId = payment.customer as string;
          let plan: IPlan['value'] = 'free';
          if (payment.amount === 2900) {
            plan = 'business';
          } else if (payment.amount === 4900) {
            plan = 'enterprise';
          }
          let isActive: boolean = false;
          if (payment.status === 'succeeded') {
            isActive = true;
          }
          await prisma.tenant.update({
            where: { customerId },
            data: {
              plan,
              isActive,
            },
          });
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  return res.status(200).json({ message: 'Received' });
}
