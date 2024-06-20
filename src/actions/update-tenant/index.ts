'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateTenantSchema } from './schema';

export * from './schema';

export const updateTenant = authActionClient
  .metadata({ actionName: 'updateTenant' })
  .schema(updateTenantSchema)
  .action(async ({ parsedInput: { company, id, email, domain } }) => {
    await prisma.tenant.update({
      where: { id },
      data: {
        company,
        email,
        domain: domain || '',
      },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    redirect(Routes.SITE.HOME);
    return { message: 'Tenant updated successfully' };
  });
