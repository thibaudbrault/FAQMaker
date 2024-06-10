import { cache } from 'react';

import prisma from 'lib/prisma';

import type { Tenant } from '@prisma/client';

export const getTenant = cache(
  async (tenantId: string): Promise<Tenant | null> => {
    try {
      if (!tenantId) {
        throw new Error('User not found');
      }
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) return null;

      return tenant;
    } catch (error) {
      throw new Error('Error fetching tenant');
    }
  },
);
