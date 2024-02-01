import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { getNodesServerSchema, createNodeServerSchema } from '@/lib';
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
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      const result = getNodesServerSchema.safeParse(req.query);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return res.status(422).json({
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
        return res.status(200).json({ success: true, nodes });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, message: `Data not provided` });
      }
      const token = await getToken({ req });
      if (token) {
        const result = createNodeServerSchema.safeParse(req.body);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { text, slug, tenantId, userId, tags, withAnswer } =
            result.data;
          const duplicateQuestion = await prisma.node.findFirst({
            where: { tenantId, question: { text: text } },
          });
          if (duplicateQuestion) {
            return res.status(409).json({
              success: false,
              error: { message: 'This question already exists' },
            });
          }
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
            return res.status(201).json({
              success: true,
              node,
              message: 'Question created successfully',
            });
          }
          return res
            .status(201)
            .json({ success: true, message: 'Question created successfully' });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
