import { getToken } from 'next-auth/jwt';

import { createIntegrationServerSchema } from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res.status(404).json({
          success: false,
          error: { message: `Form data not provided` },
        });
      }
      const token = await getToken({ req });
      if (token) {
        const result = createIntegrationServerSchema.safeParse(req.body);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { slack, tenantId } = result.data;
          await prisma.integrations.upsert({
            where: { tenantId },
            update: { slack },
            create: {
              slack,
              tenantId,
            },
          });
          return res.status(201).json({
            success: true,
            message: 'Integrations updated successfully',
          });
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
