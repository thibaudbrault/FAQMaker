import { cache } from 'react';

import { Tag } from '@prisma/client';

import prisma from 'lib/prisma';

export const getTags = cache(
  async (tenantId: string): Promise<Tag[] | null> => {
    try {
      if (!tenantId) {
        throw new Error('Tenant not found');
      }
      const tags = await prisma.tag.findMany({
        where: { tenantId },
      });

      if (!tags) return null;

      return tags;
    } catch (error) {
      throw new Error('Error fetching tags');
    }
  },
);
