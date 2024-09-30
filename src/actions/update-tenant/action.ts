'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { updateTenantSchema } from './schema';

export const updateTenant = authActionClient
  .metadata({ actionName: 'updateTenant' })
  .schema(updateTenantSchema)
  .action(async ({ parsedInput: { company, id, email, slack } }) => {
    await prisma.tenant.update({
      where: { id },
      data: {
        company,
        email,
      },
    });
    if (slack) {
      await prisma.integrations.upsert({
        where: { tenantId: id },
        update: { slack },
        create: {
          slack,
          tenantId: id,
        },
      });
    }
    revalidatePath(Routes.SITE.SETTINGS);
    redirect(Routes.SITE.HOME);
  });
