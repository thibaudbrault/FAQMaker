import { getToken } from 'next-auth/jwt';

import { getNodeServerSchema, updateNodeServerSchema } from '@/lib';
import { nodeModelWithDate } from '@/utils';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken({ req });
  if (req.method === 'GET') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Node not found` } });
      }
      if (token) {
        const result = getNodeServerSchema.safeParse({
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
          const { tenantId, id } = result.data;
          const node = await prisma.node.findUnique({
            where: { id: id as string, tenantId: tenantId as string },
            include: nodeModelWithDate,
          });
          return res.status(200).json({ success: true, node });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message });
      }
    }
  } else if (req.method === 'PUT') {
    // try {
    //   if (!req.query) {
    //     return res
    //       .status(404)
    //       .json({ success: false, error: { message: `Node not found` } });
    //   }
    //   if (token) {
    //     const result = updateNodeServerSchema.safeParse({
    //       body: req.body,
    //       query: req.query,
    //     });
    //     if (result.success === false) {
    //       const errors = result.error.formErrors.fieldErrors;
    //       return res.status(422).json({
    //         success: false,
    //         error: { message: 'Invalid request', errors },
    //       });
    //     } else {
    //       const { id } = result.data.query;
    //       const { tenantId, questionId, text, slug, userId, tags } =
    //         result.data.body;
    //       const duplicateQuestion = await prisma.node.findFirst({
    //         where: {
    //           tenantId,
    //           question: { text: text },
    //           tags: { every: { id: { in: tags }, tenantId }, some: {} },
    //         },
    //       });
    //       if (duplicateQuestion) {
    //         return res.status(409).json({
    //           success: false,
    //           message: 'This question already exists',
    //         });
    //       }
    //       await prisma.node.update({
    //         where: { id, tenantId: tenantId as string },
    //         data: {
    //           question: {
    //             update: {
    //               where: { id: questionId as string },
    //               data: {
    //                 text: text as string,
    //                 slug: slug as string,
    //                 user: { connect: { id: userId } },
    //               },
    //             },
    //           },
    //           tags: {
    //             set: tags.map((tag: string) => {
    //               return {
    //                 id: tag,
    //                 tenantId,
    //               };
    //             }),
    //           },
    //         },
    //       });
    //       return res
    //         .status(201)
    //         .json({ success: true, message: 'Question updated successfully' });
    //     }
    //   } else {
    //     return res
    //       .status(401)
    //       .json({ success: false, error: { message: 'Not signed in' } });
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     return res.status(500).json({ success: false, error: error.message });
    //   }
    // }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
