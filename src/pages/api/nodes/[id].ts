import { nodeModelWithDate } from '@/utils';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Node not found` });
      }
      const { tenantId, id } = req.query;
      const node = await prisma.node.findUnique({
        where: { id: id as string, tenantId: tenantId as string },
        include: nodeModelWithDate,
      });
      return res.status(200).json(node);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `Node not found` });
      }
      const id = req.query.id as string;
      const { tenantId, questionId, text, slug, userId, tags } = req.body;
      await prisma.node.update({
        where: { id, tenantId: tenantId as string },
        data: {
          question: {
            update: {
              where: { id: questionId as string },
              data: {
                text: text as string,
                slug: slug as string,
                user: { connect: { id: userId } },
              },
            },
          },
          tags: {
            updateMany: tags.map((tag: string) => {
              return {
                where: { id: tag, tenantId },
                data: { id: tag, tenantId },
              };
            }),
          },
        },
      });

      return res.status(201).json({ message: 'Question updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
