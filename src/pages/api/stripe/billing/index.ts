import Stripe from 'stripe';

import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

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
          .json({ success: false, message: `Customer details not provided` });
      }
      const { tenantId } = req.body;
      const { customerId } = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: {
          customerId: true,
        },
      });
      const returnUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const { url } = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return res.status(200).json({ url });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
