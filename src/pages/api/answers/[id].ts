import { getToken } from 'next-auth/jwt';

import { updateAnswerServerSchema } from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Answer not found` } });
      }
      const token = await getToken({ req });
      if (token) {
        const result = updateAnswerServerSchema.safeParse({
          body: req.body,
          query: req.query,
        });
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data.query;
          const data = result.data.body;
          await prisma.answer.update({
            where: { id },
            data,
          });
          return res
            .status(201)
            .json({ success: true, message: 'Answer updated successfully' });
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
