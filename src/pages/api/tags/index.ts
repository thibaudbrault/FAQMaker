import { getToken } from 'next-auth/jwt';

import { getTenantIdSchema, createTagServerSchema } from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      const result = getTenantIdSchema.safeParse(req.query);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return res.status(422).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { tenantId } = result.data;
        const tags = await prisma.tag.findMany({
          where: { tenantId: tenantId as string },
        });
        return res.status(200).json({ success: true, tags });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Label not provided` } });
      }
      const token = await getToken({ req });
      if (token) {
        const result = createTagServerSchema.safeParse(req.body);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { label, tenantId } = result.data;
          await prisma.tag.create({
            data: {
              label,
              tenantId,
            },
          });
          return res
            .status(201)
            .json({ success: true, message: 'Tag created successfully' });
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
