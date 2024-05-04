import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { tenantIdSchema } from '@/lib';
import prisma from 'lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

type Products = {
  product: string;
  prices: Stripe.Price[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        {
          error: 'Customer details not provided',
        },
        { status: 500 },
      );
    }
    const result = tenantIdSchema.safeParse(body);
    if (result.success === false) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json({ error: errors });
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
      const products: Products[] = [];
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
      return NextResponse.json({ url, customerId, plan });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error creating billing session',
      },
      { status: 500 },
    );
  }
}
