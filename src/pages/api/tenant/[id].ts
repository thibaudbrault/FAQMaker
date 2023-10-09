import { getIdSchemaFn } from '@/lib';
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
          .json({ success: false, message: `Tenant not found` });
      }
      const getIdSchema = getIdSchemaFn('id');
      const result = getIdSchema.safeParse(req.query);
      if (result.success === false) {
        const { errors } = result.error;
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { id } = req.query;
        const tenant = await prisma.tenant.findUnique({
          where: { id: id as string },
          include: {
            color: {
              select: {
                primary: true,
                secondary: true,
              },
            },
          },
        });
        return res.status(200).json(tenant);
      }
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
      const id = req.query.id as string;
      const data = req.body;
      await prisma.tenant.update({
        where: { id },
        data,
      });
      return res.status(201).json({ message: 'Tenant updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
