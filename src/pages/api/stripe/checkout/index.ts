import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { Routes } from '@/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Information not provided` });
      }
      const { lookup_key, customerId } = req.body;
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
      return res.json({ id: session.id });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
