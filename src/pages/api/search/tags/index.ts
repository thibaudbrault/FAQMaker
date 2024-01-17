import { NextApiRequest, NextApiResponse } from 'next';

import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';

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
      const { tenantId, searchTag } = req.query;
      const nodes = await prisma.node.findMany({
        where: {
          tenantId: tenantId as string,
          tags: {
            some: {
              label: { contains: searchTag as string, mode: 'insensitive' },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        include: nodeModel,
      });
      return res.status(200).json(nodes);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
    }
  }
}
