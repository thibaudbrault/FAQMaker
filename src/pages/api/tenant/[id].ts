import { getToken } from 'next-auth/jwt';
import Stripe from 'stripe';

import {
  deleteTenantServerSchema,
  getIdSchema,
  updateTenantServerSchema,
} from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken({ req });
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      if (token) {
        const result = getIdSchema.safeParse(req.query);
        if (result.success === false) {
          const { errors } = result.error;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data;
          const tenant = await prisma.tenant.findUnique({
            where: { id: id as string },
          });
          return res.status(200).json(tenant);
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message });
      }
    }
  } else if (req.method === 'PUT') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      if (token) {
        const result = updateTenantServerSchema.safeParse({
          body: req.body,
          query: req.query,
        });
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data.query;
          const data = result.data.body;
          await prisma.tenant.update({
            where: { id },
            data,
          });
          return res
            .status(201)
            .json({ success: true, message: 'Tenant updated successfully' });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `User not found` });
      }
      if (token) {
        const result = deleteTenantServerSchema(req.body.company).safeParse({
          body: req.body,
          query: req.query,
        });
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data.query;
          const { company } = result.data.body;
          const { customerId } = await prisma.tenant.findUnique({
            where: { id },
            select: {
              customerId: true,
            },
          });
          await prisma.tenant.delete({
            where: { id, company },
          });
          await stripe.customers.del(customerId);
          return res
            .status(200)
            .json({ success: true, message: 'Tenant deleted successfully' });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
