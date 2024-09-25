'use server';

import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

import { NewUserEmailTemplate } from '@/components';
import { ActionError, authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { createUserSchema } from './schema';
import { getMe } from '../get-me';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const tenant = await prisma.tenant.findFirst({
        where: { id: tenantId },
      });
      const me = await getMe();
      const { company } = tenant;
      const { data: domains } = await resend.domains.list();
      await resend.emails.send({
        from: `FAQMaker - <noreply@${domains?.data[0].name}>`,
        to: [email],
        subject: `You're invited to FAQMaker`,
        react: NewUserEmailTemplate({
          company,
          username: email,
          invitedByUsername: me?.name,
          invitedByEmail: me?.email,
        }),
      });
      revalidatePath(Routes.SITE.SETTINGS);
      return { message: 'User created successfully' };
    },
  );
