import { NextApiRequest, NextApiResponse } from 'next';

import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';
import { getToken } from 'next-auth/jwt';
import { getSearchServerSchema } from '@/lib';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: {message: `Tenant not found`} });
      }
      const token = await getToken({ req });
      if (token) {
        const result = getSearchServerSchema.safeParse(req.query);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { tenantId, searchQuery } = result.data;
          const nodes = await prisma.node.findMany({
            where: {
              tenantId: tenantId as string,
              question: {
                text: { contains: searchQuery as string, mode: 'insensitive' },
              },
            },
            orderBy: { createdAt: 'desc' },
            include: nodeModel,
          });
          return res.status(200).json(nodes);
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
