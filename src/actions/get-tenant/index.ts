import { cache } from 'react';

import { redirect } from 'next/navigation';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import type { Tenant } from '@prisma/client';

export const getTenant = cache(async (tenantId: string): Promise<Tenant> => {
  try {
    if (!tenantId) {
      throw new Error('User not found');
    }
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) redirect(Routes.SITE.HOME);

    return tenant;
  } catch (error) {
    throw new Error('Error fetching tenant');
  }
});
