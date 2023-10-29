import { getIdSchemaFn, getUsersCount } from '@/lib';
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
        const users = await prisma.user.findMany({
          where: { tenantId: tenantId as string },
        });
        return res.status(200).json(users);
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
          .json({ success: false, message: `Form data not provided` });
      }
      const { email, role, tenantId } = req.body;
      const userExists = await prisma.user.findUnique({
        where: { email, tenantId },
      });
      if (userExists) {
        return res
          .status(409)
          .json({ success: false, message: 'User already exists' });
      }
      const usersCount = await getUsersCount(tenantId);
      if (!usersCount) {
        return res.status(404).json({
          success: false,
          message: 'Could not find the number of users',
        });
      }
      const { plan } = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true },
      });
      if (
        (plan === 'free' && usersCount >= 5) ||
        (plan === 'business' && usersCount >= 100)
      ) {
        return res.status(402).json({
          success: false,
          message: 'You reached the maximum number of users.',
        });
      }
      await prisma.user.create({
        data: {
          email,
          role,
          tenantId,
        },
      });
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
