import Stripe from 'stripe';

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
      const isCustomer = await stripe.customers.search({
        query: `email:'${companyEmail}'`,
      });
      if (isCustomer.data.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'A customer with the same company email already exists',
        });
      }
      const customer = await stripe.customers.create({
        email: companyEmail,
        name: company,
      });
      return res.status(201).json({ customerId: customer.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
