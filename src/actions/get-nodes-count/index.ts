import { cache } from 'react';

import prisma from 'lib/prisma';

export const getNodesCount = cache(
  async (tenantId: string): Promise<number> => {
    try {
      if (!tenantId) {
        throw new Error('Tenant not found');
      }
      const nodes = await prisma.node.count({
        where: { tenantId },
      });

      if (!nodes) return 0;

      return nodes;
    } catch {
      throw new Error('Error fetching nodes count');
    }
  },
);
