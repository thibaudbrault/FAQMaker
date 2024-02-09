import { Storage } from '@google-cloud/storage';
import { getToken } from 'next-auth/jwt';

import { getIdSchema, updateTenantServerSchema } from '@/lib';
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
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      if (token) {
        const result = getIdSchema.safeParse(req.query);
        if (result.success === false) {
          const { errors } = result.error;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const { id } = result.data;
          const tenant = await prisma.tenant.findUnique({
            where: { id: id as string },
            include: {
              color: {
                select: {
                  foreground: true,
                  background: true,
                  border: true,
                },
              },
            },
          });
          return res.status(200).json(tenant);
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
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      if (token) {
        const result = updateTenantServerSchema.safeParse({
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
          const storage = new Storage({
            projectId: process.env.PROJECT_ID,
            credentials: {
              client_email: process.env.CLIENT_EMAIL,
              private_key: process.env.PRIVATE_KEY,
            },
          });

          const bucket = storage.bucket(process.env.BUCKET_NAME);
          const file = bucket.file(result.data.body.logo);
          const options = {
            expires: Date.now() + 1 * 60 * 1000, //  1 minute,
            fields: { 'x-goog-meta-test': 'data' },
          };

          const [response] = await file.generateSignedPostPolicyV4(options);
          const { id } = result.data.query;
          const data = result.data.body;
          await prisma.tenant.update({
            where: { id },
            data,
          });
          return res
            .status(201)
            .json({ success: true, message: 'Tenant updated successfully' });
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
