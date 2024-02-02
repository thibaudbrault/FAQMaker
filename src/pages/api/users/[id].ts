import { getToken } from 'next-auth/jwt';

import {
  deleteUserServerSchema,
  getIdSchema,
  updateUserServerSchema,
} from '@/lib';
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
          .json({ success: false, message: `Email not provided` });
      }
      if (token) {
        const result = getIdSchema.safeParse(req.query);
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data;
          const user = await prisma.user.findUnique({
            where: { id },
          });
          return res.status(200).json(user);
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
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `User not found` });
      }
      if (token) {
        const result = updateUserServerSchema.safeParse({
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
          await prisma.user.update({
            where: { id },
            data,
          });
          return res
            .status(201)
            .json({ success: true, message: 'User updated successfully' });
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
  } else if (req.method === 'DELETE') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, message: `User not found` });
      }
      if (token) {
        const result = deleteUserServerSchema.safeParse({
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
          const { tenantId } = result.data.body;
          await prisma.user.delete({
            where: { id, tenantId },
          });
          return res
            .status(200)
            .json({ success: true, message: 'User deleted successfully' });
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
