import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Tag not found` });
      }
      const id = req.query.id as string;
      const tenantId = req.body.tenantId as string;
      await prisma.tag.delete({
        where: { id, tenantId },
      });
      return res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
