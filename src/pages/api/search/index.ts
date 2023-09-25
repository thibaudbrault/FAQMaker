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
      const { tenantId, searchQuery } = req.query;
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
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}
