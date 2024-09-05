/* eslint-disable no-case-declarations */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';

import { STRIPE_VERSION } from '@/utils';
import prisma from 'lib/prisma';

import type { IPlan } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_VERSION,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.updated',
    'customer.updated',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          const subscriptionId = session.subscription as string;
          const email = session.customer_details?.email;
          let checkoutPlan: IPlan['value'] = 'free';
          if (session.amount_total === 1900) {
            checkoutPlan = 'startup';
          } else if (session.amount_total === 2900) {
            checkoutPlan = 'enterprise';
          }
          await prisma.tenant.update({
            where: { email },
            data: {
              subscriptionId,
              plan: checkoutPlan,
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
        case 'customer.updated':
          const customer = event.data.object as Stripe.Customer;
          const customerId = customer.id;
          await prisma.tenant.update({
            where: { customerId },
            data: {
              company: customer.name,
              email: customer.email,
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
          let isActive: boolean = false;
          if (payment.status === 'succeeded') {
            isActive = true;
          }
          await prisma.tenant.update({
            where: { customerId: paymentCustomer },
            data: {
              isActive,
            },
          });
          break;
        default:
          return NextResponse.json(
            { message: `Unhandled event: ${event.type}` },
            { status: 400 },
          );
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Webhook error: ${error.message}` },
        { status: 500 },
      );
    }
  }
  return new NextResponse('Received');
}
