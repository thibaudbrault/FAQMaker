import { getToken } from 'next-auth/jwt';

import { getIdSchema } from '@/lib';
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
      const token = await getToken({ req });
      if (token) {
        const result = getIdSchema.safeParse(req.query);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data;
          const integrations = await prisma.integrations.findUnique({
            where: { tenantId: id as string },
          });
          return res.status(200).json({ success: true, integrations });
        }
      } else {
        return res.status(401).json({
          success: false,
          error: { success: false, message: 'Not signed in' },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
