import { Resend } from 'resend';

import { RegisterEmailTemplate } from '@/components';
import { createTenantServerSchema } from '@/lib';
import prisma from 'lib/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);
const { data: domains } = await resend.domains.list();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      if (!req.body) {
        return res.status(404).json({
          success: false,
          error: { message: `Information not provided` },
        });
      }
      const result = createTenantServerSchema.safeParse(req.body);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return res.status(422).json({
          success: false,
          error: { message: 'Invalid request', errors },
        });
      } else {
        const { company, companyEmail, email, domain } = result.data;
        const tenantExists = await prisma.tenant.findUnique({
          where: { email: companyEmail },
        });
        if (tenantExists) {
          return res.status(409).json({
            success: false,
            error: {
              message: 'An account with the same company email already exists',
            },
          });
        }
        const userExists = await prisma.user.findUnique({
          where: { email },
        });
        if (userExists) {
          return res.status(409).json({
            success: false,
            error: { message: 'A user with the same email already exists' },
          });
        }
        const tenant = await prisma.tenant.create({
          data: {
            company,
            email: companyEmail,
            domain,
          },
        });
        if (!tenant) {
          return res.status(500).json({
            success: false,
            error: { message: 'There was a problem when creating the account' },
          });
        }
        const user = await prisma.user.create({
          data: {
            email,
            role: 'tenant',
            tenant: { connect: { id: tenant.id } },
          },
        });
        if (!user) {
          return res.status(500).json({
            success: false,
            error: { message: 'There was a problem when creating the user' },
          });
        }
        await resend.emails.send({
          from: `noreply@${domains.data[0].name}`,
          to: [companyEmail],
          subject: 'Welcome to FAQMaker',
          react: RegisterEmailTemplate(),
        });
        return res
          .status(201)
          .json({ success: true, message: 'Account created successfully' });
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
