import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { text, userId } = req.body.params;
      await prisma.answer.update({
        where: { id: id as string },
        data: {
          text,
          userId,
        },
      });

      return res.status(201).json({ message: 'Answer updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
