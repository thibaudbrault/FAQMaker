'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { upsertIntegrationsSchema } from './schema';

export * from './schema';

export const upsertIntegrations = authActionClient
  .metadata({ actionName: 'upsertIntegrations' })
  .schema(upsertIntegrationsSchema)
  .action(async ({ parsedInput: { slack, tenantId } }) => {
    await prisma.integrations.upsert({
      where: { tenantId },
      update: { slack },
      create: {
        slack,
        tenantId,
      },
    });
    revalidatePath(Routes.SITE.SETTINGS);
    redirect(Routes.SITE.HOME);
    return { message: 'Integrations updated successfully' };
  });
