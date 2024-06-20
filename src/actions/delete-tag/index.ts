'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { deleteTagSchema } from './schema';

export * from './schema';

export const deleteTag = authActionClient
  .metadata({ actionName: 'deleteTag' })
  .schema(deleteTagSchema)
  .action(async ({ parsedInput: { id, tenantId } }) => {
    await prisma.tag.delete({
      where: { id, tenantId },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    return { message: 'Tag deleted successfully' };
  });
