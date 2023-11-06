import { NextApiRequest, NextApiResponse } from 'next';

import prisma from 'lib/prisma';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
      const { value, email, priceId, customerId } = req.body;
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer: customerId,
        customer_update: {
          address: 'auto',
        },
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register/plan?status=cancel`,
        automatic_tax: { enabled: true },
      });
      // await prisma.tenant.update({
      //   where: { email },
      //   data: {
      //     plan: value,
      //   },
      // });
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
