'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { updateTagSchema } from './schema';

export const updateTag = authActionClient
  .metadata({ actionName: 'updateTag' })
  .schema(updateTagSchema)
  .action(async ({ parsedInput: { label, tenantId, id } }) => {
    await prisma.tag.update({
      where: { id, tenantId },
      data: {
        label,
      },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    return { message: 'Tag updated successfully' };
  });
