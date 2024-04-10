import { cache } from 'react';

import prisma from 'lib/prisma';

export const getUsersCount = cache(
  async (tenantId: string): Promise<number> => {
    try {
      if (!tenantId) {
        throw new Error('Tenant not found');
      }
      const users = await prisma.user.count({
        where: { tenantId },
      });

      if (!users) return 0;

      return users;
    } catch (error) {
      throw new Error('Error fetching users count');
    }
  },
);
