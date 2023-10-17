import { NextApiRequest, NextApiResponse } from 'next';

import { getIdSchemaFn, questionCreateServerSchema } from '@/lib';
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
      const getTenantIdSchema = getIdSchemaFn('tenantId');
      const result = getTenantIdSchema.safeParse(req.query);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { tenantId } = result.data;
        const nodes = await prisma.node.findMany({
          where: { tenantId: tenantId as string },
          orderBy: { createdAt: 'desc' },
          include: nodeModel,
        });
        return res.status(200).json(nodes);
      }
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Data not provided` });
      }
      const result = questionCreateServerSchema.safeParse(req.body);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { text, slug, tenantId, userId, tags } = result.data;
        await prisma.node.create({
          data: {
            tenant: { connect: { id: tenantId } },
            question: {
              create: { text, slug, user: { connect: { id: userId } } },
            },
            tags: {
              connect: tags.map((tag) => ({ id: tag })),
            },
          },
        });
        return res
          .status(201)
          .json({ message: 'Question created successfully' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
