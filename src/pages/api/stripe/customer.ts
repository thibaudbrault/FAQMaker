import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function hadndler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tenant not found` });
      }
      const { tenantId } = req.query;
      const tags = await prisma.tag.findMany({
        where: { tenantId: tenantId as string },
      });
      return res.status(200).json(tags);
    } catch (error) {
      res.status(400).end();
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Email not provided` });
      }
      const { companyEmail, company } = req.body;
      const customer = await stripe.customers.create({
        email: companyEmail,
        name: company,
      });
      return res.status(201).json({ customerId: customer.id });
    } catch (error) {
      res.status(500).end();
    }
  }
}
