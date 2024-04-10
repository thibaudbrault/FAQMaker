import { cache } from 'react';

import { Integrations } from '@prisma/client';

import prisma from 'lib/prisma';

export const getIntegration = cache(
  async (tenantId: string): Promise<Integrations | null> => {
    try {
      if (!tenantId) {
        throw new Error('Tenant not found');
      }
      const integrations = await prisma.integrations.findUnique({
        where: { tenantId },
      });

      if (!integrations) return null;

      return integrations;
    } catch (error) {
      throw new Error('Error fetching integrations');
    }
  },
);
