import Stripe from 'stripe';

import { getTenantIdSchema } from '@/lib';
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
        return res.status(404).json({
          success: false,
          error: { message: `Customer details not provided` },
        });
      }
      const result = getTenantIdSchema.safeParse(req.body);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return res.status(422).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { tenantId } = result.data;
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
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
