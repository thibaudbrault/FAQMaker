import { cache } from 'react';

import { Tenant } from '@prisma/client';

import prisma from 'lib/prisma';

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
