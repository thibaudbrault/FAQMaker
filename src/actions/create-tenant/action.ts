'use server';

// import { Resend } from 'resend';

import { ActionError, actionClient } from '@/lib/safe-actions';
import prisma from 'lib/prisma';

import 'server-only';
import { createTenantSchema } from './schema';

// const resend = new Resend(process.env.RESEND_API_KEY);
// const { data: domains } = await resend.domains.list();

export const createTenant = actionClient
  .metadata({ actionName: 'createTenant' })
  .schema(createTenantSchema)
  .action(async ({ parsedInput: { company, companyEmail, email, domain } }) => {
    const tenantExists = await prisma.tenant.findUnique({
      where: { email: companyEmail },
    });
    if (tenantExists) {
      throw new ActionError(
        'An account with the same company email already exists',
      );
    }
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new ActionError('A user with the same email already exists');
    }
    const tenant = await prisma.tenant.create({
      data: {
        company,
        email: companyEmail,
        domain,
      },
    });
    if (!tenant) {
      throw new ActionError('There was a problem when creating the account');
    }
    const user = await prisma.user.create({
      data: {
        email,
        role: 'tenant',
        tenant: { connect: { id: tenant.id } },
      },
    });
    if (!user) {
      throw new ActionError('There was a problem when creating the user');
    }
    // await resend.emails.send({
    //   from: `noreply@${domains?.data[0].name}`,
    //   to: [companyEmail],
    //   subject: 'Welcome to FAQMaker',
    //   react: RegisterEmailTemplate(),
    // });
    return { message: 'Account created successfully' };
  });
