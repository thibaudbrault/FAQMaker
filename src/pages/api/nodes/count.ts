import { getToken } from 'next-auth/jwt';

import { getNodeServerSchema, getTenantIdSchema, updateNodeServerSchema } from '@/lib';
import { nodeModelWithDate } from '@/utils';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

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
          .json({ success: false, error: { message: `Node not found` } });
      }
      if (token) {
        const result = getTenantIdSchema.safeParse(req.query);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { tenantId } = result.data;
          let node = await prisma.node.count({
            where: { tenantId },
          });
          if (!node) {
            node = 0
          } 
          return res.status(200).json(node);
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
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
