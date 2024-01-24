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
          .json({ success: false, message: `Company details not provided` });
      }
      const { companyEmail, company } = req.body;
      const customerExists = await stripe.customers.search({
        query: `email:'${companyEmail}'`,
      });
      if (customerExists.data.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'A customer with the same company email already exists',
        });
      }
      const customer = await stripe.customers.create({
        email: companyEmail,
        name: company,
      });
      if (!customer) {
        return res
          .status(500)
          .json({ message: 'There was a problem when creating the customer' });
      }
      await prisma.tenant.update({
        where: { email: companyEmail },
        data: {
          customerId: customer.id,
        },
      });
      return res.status(201).json({ customerId: customer.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
