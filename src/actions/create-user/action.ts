'use server';

import { revalidatePath } from 'next/cache';
// import { Resend } from 'resend';

import { ActionError, authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

// import { NewUserEmailTemplate } from '@/components';
import { createUserSchema } from './schema';

// const resend = new Resend(process.env.RESEND_API_KEY);

export const createUser = authActionClient
  .metadata({ actionName: 'createUser' })
  .schema(createUserSchema)
  .action(
    async ({ parsedInput: { email, role, plan, usersCount, tenantId } }) => {
      const userExists = await prisma.user.findUnique({
        where: { email, tenantId },
      });
      if (userExists) throw new ActionError('User already exists');
      if (typeof usersCount !== 'number')
        throw new ActionError('Could not find the number of users');
      if (
        (plan === 'free' && usersCount >= 5) ||
        (plan === 'startup' && usersCount >= 100)
      ) {
        throw new ActionError('You reached the maximum number of users');
      }
      const newUser = await prisma.user.create({
        data: {
          email,
          role,
          tenantId,
        },
      });
      if (!newUser) {
        throw new ActionError('User could not be created');
      }
      // const { data: domains } = await resend.domains.list();
      // await resend.emails.send({
      //   from: `noreply@${domains?.data[0].name}`,
      //   to: [email],
      //   subject: 'Welcome to FAQMaker',
      //   react: NewUserEmailTemplate(),
      // });
      revalidatePath(Routes.SITE.SETTINGS);
      return { message: 'User created successfully' };
    },
  );
