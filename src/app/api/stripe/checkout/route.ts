import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createCheckoutSchema } from '@/lib';
import { Routes } from '@/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (!req.body) {
      return { error: 'Information not provided' };
    }
    const result = createCheckoutSchema.safeParse(req.body);
    if (result.success === false) {
      const errors = result.error.flatten().fieldErrors;
      return { error: errors };
    } else {
      const { lookup_key, customerId } = result.data;
      const prices = await stripe.prices.list({
        lookup_keys: [lookup_key],
      });
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: prices.data[0].id,
            quantity: 1,
          },
        ],
        customer: customerId,
        customer_update: {
          address: 'auto',
        },
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${Routes.SITE.LOGIN}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register/plan?status=cancel`,
        automatic_tax: { enabled: true },
      });
      return NextResponse.json({ id: session.id });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error creating checkout session' });
  }
}
