import { Storage } from '@google-cloud/storage';
import { getToken } from 'next-auth/jwt';

import { updateLogoServerSchema } from '@/lib';
import { bucketName } from '@/utils';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = await getToken({ req });
  if (req.method === 'PUT') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: { message: `Tenant not found` } });
      }
      if (token) {
        const result = updateLogoServerSchema.safeParse({
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
          const { logoUrl } = result.data.body;
          const { logo: oldLogo } = await prisma.tenant.findUnique({
            where: { id },
            select: {
              logo: true,
            },
          });
          if (oldLogo) {
            const storage = new Storage({
              projectId: process.env.PROJECT_ID,
              credentials: {
                client_email: process.env.CLIENT_EMAIL,
                private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
              },
            });
            const bucket = storage.bucket(bucketName);
            const fileName = oldLogo.replace(
              'https://storage.googleapis.com/faqmaker/',
              '',
            );
            bucket.file(fileName).delete();
          }
          await prisma.tenant.update({
            where: { id },
            data: {
              logo: logoUrl,
            },
          });
          return res
            .status(201)
            .json({ success: true, message: 'Logo uploaded successfully' });
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
