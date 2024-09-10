'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { deletePinSchema } from './schema';

export const deletePin = authActionClient
  .metadata({ actionName: 'deletePin' })
  .schema(deletePinSchema)
  .action(async ({ parsedInput: { nodeId, tenantId } }) => {
    await prisma.node.update({
      where: { id: nodeId },
      data: {
        isPinned: false,
      },
    });
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        pinnedAmount: {
          decrement: 1,
        },
      },
    });
    revalidatePath(Routes.SITE.HOME);
    return { message: 'Question unpinned' };
  });
