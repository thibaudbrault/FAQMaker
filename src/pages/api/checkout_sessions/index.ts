import { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const priceId = '{{PRICE_ID}}';
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1NsiZpDrot5aQrVBMkNYEvHY',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register/confirm`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register/plan`,
        automatic_tax: { enabled: true },
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
