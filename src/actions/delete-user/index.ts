'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { deleteUserSchema } from './schema';

export * from './schema';

export const deleteUser = authActionClient
  .metadata({ actionName: 'deleteUser' })
  .schema(deleteUserSchema)
  .action(async ({ parsedInput: { id, tenantId } }) => {
    await prisma.user.delete({
      where: { id, tenantId },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    return { message: 'User deleted successfully' };
  });
