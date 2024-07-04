'use server';

// import { Resend } from 'resend';
import Stripe from 'stripe';

import { ActionError, actionClient } from '@/lib/safe-actions';
import { STRIPE_VERSION } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createTenantSchema } from './schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_VERSION,
});

// const resend = new Resend(process.env.RESEND_API_KEY);
// const { data: domains } = await resend.domains.list();

export const createTenant = actionClient
  .metadata({ actionName: 'createTenant' })
  .schema(createTenantSchema)
  .action(async ({ parsedInput: { company, companyEmail, email } }) => {
    const tenantExists = await prisma.tenant.findFirst({
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
    const customerExists = await stripe.customers.search({
      query: `email:'${companyEmail}'`,
    });
    if (customerExists.data.length > 0) {
      throw new ActionError(
        'A customer with the same company email already exists',
      );
    }
    const customer = await stripe.customers.create({
      email: companyEmail,
      name: company,
    });
    if (!customer) {
      throw new ActionError('There was a problem creating the customer');
    }
    const updatedTenant = await prisma.tenant.update({
      where: { email: companyEmail, id: tenant.id },
      data: {
        customerId: customer.id,
      },
    });
    if (!updatedTenant) {
      throw new ActionError('There was a problem updating the tenant');
    }
    return {
      customerId: customer.id,
      message: 'Your account has successfully been created',
    };
  });
