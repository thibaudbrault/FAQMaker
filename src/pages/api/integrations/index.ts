import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
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
