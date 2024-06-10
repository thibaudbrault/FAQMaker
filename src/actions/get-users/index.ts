import { cache } from 'react';

import prisma from 'lib/prisma';

import type { User } from '@prisma/client';

export const getUsers = cache(
  async (tenantId: string): Promise<User[] | null> => {
    try {
      if (!tenantId) {
        throw new Error('User not found');
      }
      const users = await prisma.user.findMany({
        where: { tenantId },
      });
      if (!users) return null;
      return users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  },
);
