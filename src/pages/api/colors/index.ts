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
      const { foreground, background, border, tenantId } = req.body;
      await prisma.color.upsert({
        where: { tenantId },
        update: { foreground, background, border },
        create: {
          foreground,
          background,
          border,
          tenantId,
        },
      });
      return res.status(201).json({ message: 'Colors updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
