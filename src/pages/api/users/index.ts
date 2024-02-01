import { getIdSchemaFn, getTenantIdSchema, getUsersCount, createUserServerSchema } from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';
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
          .json({ success: false, message: `Tenant not found` });
      }
      const result = getTenantIdSchema.safeParse(req.query);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return res.status(422).json({
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
        return res.status(404).json({success: false, error: error.message });
      }
    }
  } else if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res
          .status(404)
          .json({ success: false, error: {message: `Form data not provided`} });
      }
      const token = await getToken({ req });
      if (token) {
        const result = createUserServerSchema.safeParse(req.body);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { email, role, name, newUsersArray, tenantId } = result.data;
          if (role) {
            const userExists = await prisma.user.findUnique({
              where: { email, tenantId },
            });
            if (userExists) {
              return res
                .status(409)
                .json({ success: false, error: {message: 'User already exists'} });
            }
            const usersCount = await getUsersCount(tenantId);
            if (!usersCount) {
              return res.status(404).json({
                success: false,
                error: {message: 'Could not find the number of users'},
              });
            }
            const { plan } = await prisma.tenant.findUnique({
              where: { id: tenantId },
              select: { plan: true },
            });
            if (
              (plan === 'free' && usersCount >= 5) ||
              (plan === 'startup' && usersCount >= 100)
            ) {
              return res.status(402).json({
                success: false,
                error: {message: 'You reached the maximum number of users.'},
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
          } else {
            const errors = [];
            for (const element of newUsersArray) {
              const userEmail = element;
              if (!userEmail) {
                errors.push({
                  email: userEmail,
                  message: 'Empty email, skipping user creation',
                });
                continue;
              }
              const userExists = await prisma.user.findUnique({
                where: { email: userEmail, tenantId },
              });
              if (userExists) {
                errors.push({
                  email: userEmail,
                  message: 'User already exists',
                });
                continue;
              }
              const usersCount = await getUsersCount(tenantId);
              if (!usersCount) {
                errors.push({
                  email: userEmail,
                  message: 'Could not find the number of users',
                });
                continue;
              }
              const { plan } = await prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { plan: true },
              });
              if (
                (plan === 'free' && usersCount >= 5) ||
                (plan === 'startup' && usersCount >= 100)
              ) {
                errors.push({
                  email: userEmail,
                  message: 'You reached the maximum number of users.',
                });
                continue;
              }
              await prisma.user.create({
                data: {
                  email: userEmail,
                  role: 'user',
                  tenantId,
                },
              });
            }
            if (errors.length > 0) {
              return res.status(409).json({
                success: false,
                message: 'Some users could not be created',
                errors,
              });
            }
            return res.status(201).json({ message: 'Users created successfully' });
          }
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({success: false, error: error.message });
      }
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: { message: 'Method not allowed' } });
  }
}
