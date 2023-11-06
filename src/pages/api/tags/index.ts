import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function hadndler(
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
      const { tenantId } = req.query;
      const tags = await prisma.tag.findMany({
        where: { tenantId: tenantId as string },
      });
      return res.status(200).json(tags);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Label not provided` });
      }
      const { label, tenantId } = req.body;
      await prisma.tag.create({
        data: {
          label,
          tenantId,
        },
      });
      return res.status(201).json({ message: 'Tag created successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
