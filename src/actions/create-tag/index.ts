'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createTagSchema } from './schema';

export * from './schema';

export const createTag = authActionClient
  .metadata({ actionName: 'createTag' })
  .schema(createTagSchema)
  .action(async ({ parsedInput: { label, tenantId, plan, tagsCount } }) => {
    if (
      (plan === 'free' && tagsCount >= 3) ||
      (plan === 'startup' && tagsCount >= 10)
    ) {
      return { error: 'You reached the maximum number of tags.' };
    }
    await prisma.tag.create({
      data: {
        label,
        tenantId,
      },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    return { message: 'Tag created successfully' };
  });
