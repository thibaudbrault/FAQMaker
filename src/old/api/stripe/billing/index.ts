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
        const { customerId, plan } = await prisma.tenant.findUnique({
          where: { id: tenantId },
          select: {
            customerId: true,
            plan: true,
          },
        });
        const usersCount = await prisma.user.count({
          where: { tenantId },
        });
        const tagsCount = await prisma.tag.count({
          where: { tenantId },
        });
        const productsList = await stripe.products.list({
          active: true,
        });
        const [free, startup, enterprise] = productsList.data;
        const products = [];
        switch (plan) {
          case 'free':
            products.push(
              { product: free.id, prices: [free.default_price] },
              { product: startup.id, prices: [startup.default_price] },
              { product: enterprise.id, prices: [enterprise.default_price] },
            );
            break;
          case 'startup':
            if (usersCount <= 5 && tagsCount <= 3) {
              products.push(
                { product: free.id, prices: [free.default_price] },
                { product: startup.id, prices: [startup.default_price] },
                { product: enterprise.id, prices: [enterprise.default_price] },
              );
            } else {
              products.push(
                { product: startup.id, prices: [startup.default_price] },
                { product: enterprise.id, prices: [enterprise.default_price] },
              );
            }
            break;
          case 'enterprise':
            if (usersCount <= 5 && tagsCount <= 3) {
              products.push(
                { product: free.id, prices: [free.default_price] },
                { product: startup.id, prices: [startup.default_price] },
                { product: enterprise.id, prices: [enterprise.default_price] },
              );
            } else if (usersCount <= 100 && tagsCount <= 10) {
              products.push(
                { product: startup.id, prices: [startup.default_price] },
                { product: enterprise.id, prices: [enterprise.default_price] },
              );
            } else {
              products.push({
                product: enterprise.id,
                prices: [enterprise.default_price],
              });
            }
            break;
          default:
            break;
        }
        const configuration = await stripe.billingPortal.configurations.create({
          business_profile: {
            privacy_policy_url: 'https://example.com/privacy',
            terms_of_service_url: 'https://example.com/terms',
          },
          default_return_url: process.env.NEXT_PUBLIC_SITE_URL,
          features: {
            customer_update: {
              allowed_updates: ['name', 'email'],
              enabled: true,
            },
            invoice_history: {
              enabled: true,
            },
            payment_method_update: {
              enabled: true,
            },
            subscription_cancel: {
              enabled: true,
              mode: 'at_period_end',
            },
            subscription_update: {
              enabled: true,
              default_allowed_updates: ['price', 'promotion_code'],
              products: products,
            },
          },
        });
        const { url } = await stripe.billingPortal.sessions.create({
          customer: customerId,
          configuration: configuration.id,
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
