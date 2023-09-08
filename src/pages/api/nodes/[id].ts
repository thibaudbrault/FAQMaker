import { nodeModel } from '@/utils';
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
        include: nodeModel,
      });
      return res.status(200).json(node);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
    //   } else if (req.method === 'POST') {
    //     try {
    //       if (!req.body) {
    //         return res
    //           .status(404)
    //           .json({ success: false, message: `Form data not provided` });
    //       }
    //       const { firstName, lastName, email, role, tenantId } = req.body;
    //       await prisma.user.create({
    //         data: {
    //           firstName,
    //           lastName,
    //           email,
    //           role,
    //           tenantId,
    //         },
    //       });
    //       return res.status(201).json({ message: 'User created successfully' });
    //     } catch (error) {
    //       return res.status(500).json({ error: error.message });
    //     }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { tenantId, questionId, text, slug, userId } = req.body;
      await prisma.node.update({
        where: { id: id as string, tenantId: tenantId as string },
        data: {
          question: {
            update: {
              where: { id: questionId as string },
              data: {
                text: text as string,
                slug: slug as string,
              },
            },
          },
        },
      });

      return res.status(201).json({ message: 'Question updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    //   } else if (req.method === 'DELETE') {
    //     try {
    //       if (!req.query) {
    //         return res
    //           .status(404)
    //           .json({ success: false, message: `User not found` });
    //       }
    //       const { userId } = req.query;
    //       await prisma.user.delete({ where: { id: userId as string } });
    //       return res.status(200).end();
    //     } catch (error) {
    //       return res.status(500).json({ error: error.message });
    //     }
  }
}
