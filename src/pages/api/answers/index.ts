import { NextApiRequest, NextApiResponse } from 'next';

import { createAnswerServerSchema, getUserIdSchema } from '@/lib';
import prisma from 'lib/prisma';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `User not found` } });
      }
      const result = getUserIdSchema.safeParse(req.query);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return res.status(422).json({
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
        return res.status(200).json({success: true, answers});
      }
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(404)
          .json({ success: false, error: { error: error.message } });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Answer not provided` } });
      }
      const token = await getToken({ req });
      if (token) {
        const result = createAnswerServerSchema.safeParse(req.body);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { text, nodeId, userId } = result.data;
          await prisma.answer.create({
            data: {
              nodeId,
              userId,
              text,
            },
          });
          return res
            .status(201)
            .json({success: true, message: 'Answer created successfully' });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({ success: false, error: { error: error.message } });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
