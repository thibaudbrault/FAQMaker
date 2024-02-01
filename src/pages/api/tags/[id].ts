import { deleteTagServerSchema } from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    try {
      if (!req.query) {
        return res
          .status(404)
          .json({ success: false, error: {message: `Tag not found`} });
      }
      const token = await getToken({ req });
      if (token) {
        const result = deleteTagServerSchema.safeParse({body:req.body, query: req.query});
        if (result.success === false) {
          const errors = result.error.formErrors.fieldErrors;
          return res.status(422).json({
            success: false,
            error: { message: 'Invalid request', errors },
          });
        } else {
          const {id} = result.data.query
          const {tenantId} = result.data.body
          await prisma.tag.delete({
            where: { id, tenantId },
          });
          return res.status(200).json({success: true, message: 'Tag deleted successfully' });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: { message: 'Not signed in' } });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
}
