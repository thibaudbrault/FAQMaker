import { getIdSchemaFn, getUsersCount } from '@/lib';
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
          .json({ success: false, message: `Tenant not found` });
      }
      const getTenantIdSchema = getIdSchemaFn('tenantId');
      const result = getTenantIdSchema.safeParse(req.query);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { tenantId } = result.data;
        const users = await prisma.user.findMany({
          where: { tenantId: tenantId as string },
        });
        return res.status(200).json(users);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Form data not provided` });
      }
      const { slack, tenantId } = req.body;
      await prisma.integrations.upsert({
        where: { tenantId },
        update: { slack },
        create: {
          slack,
          tenantId,
        },
      });
      return res
        .status(201)
        .json({ message: 'Integrations updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
