import { NextApiRequest, NextApiResponse } from 'next';

import { getNodesServerSchema, questionCreateServerSchema } from '@/lib';
import { OFFSET, nodeModel } from '@/utils';
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
      const getTenantIdSchema = getNodesServerSchema();
      const result = getTenantIdSchema.safeParse(req.query);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { tenantId, page } = result.data;
        const pageInt = Number(page);
        const nodes = await prisma.node.findMany({
          where: { tenantId: tenantId as string },
          orderBy: { createdAt: 'desc' },
          skip: pageInt * OFFSET,
          take: OFFSET,
          include: nodeModel,
        });
        return res.status(200).json(nodes);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
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
        const { text, slug, tenantId, userId, tags, withAnswer } = result.data;
        const node = await prisma.node.create({
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
        if (withAnswer) {
          return res
            .status(201)
            .json({ node, message: 'Question created successfully' });
        }
        return res
          .status(201)
          .json({ message: 'Question created successfully' });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
