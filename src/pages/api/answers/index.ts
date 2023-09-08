import { NextApiRequest, NextApiResponse } from 'next';

import { getIdSchemaFn } from '@/lib';
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
          .json({ success: false, message: `User not found` });
      }
      const getUserIdSchema = getIdSchemaFn('userId');
      const result = getUserIdSchema.safeParse(req.query);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { userId } = result.data;
        const answers = await prisma.node.findMany({
          where: { answer: { is: { userId } } },
          include: {
            answer: {
              select: {
                text: true,
              },
            },
            question: {
              select: {
                id: true,
                slug: true,
                text: true,
              },
            },
          },
        });
        return res.status(200).json(answers);
      }
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}
