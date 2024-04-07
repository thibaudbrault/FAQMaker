import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.query.id as string;

  try {
    if (!id.startsWith('cs_')) {
      throw new Error('Incorrect ID.');
    }
    const checkoutSession = await stripe.checkout.sessions.retrieve(id);
    return res.status(200).json(checkoutSession);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
