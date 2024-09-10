'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { updateUserSchema } from './schema';

export const updateUser = authActionClient
  .metadata({ actionName: 'updateUser' })
  .schema(updateUserSchema)
  .action(
    async ({
      parsedInput: { tenantId, email, name, role },
      ctx: { userId },
    }) => {
      await prisma.user.update({
        where: { id: userId, tenantId },
        data: {
          email,
          name,
          role,
        },
      });
      revalidatePath(Routes.SITE.PROFILE);
      return { message: 'User updated successfully' };
    },
  );
