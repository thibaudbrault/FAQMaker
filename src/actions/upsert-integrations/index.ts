'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { upsertIntegrationsSchema } from './schema';

type UpsertIntegrationsData = {
  slack: string;
  tenantId: string;
};

export async function upsertIntegrations(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as UpsertIntegrationsData;
    const session = await auth();
    if (session) {
      const result = upsertIntegrationsSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { slack, tenantId } = result.data;
      await prisma.integrations.upsert({
        where: { tenantId },
        update: { slack },
        create: {
          slack,
          tenantId,
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating integrations' };
  }
  revalidatePath(Routes.SITE.SETTINGS);
  redirect(Routes.SITE.HOME);
  return { message: 'Integrations updated successfully' };
}
