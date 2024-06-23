import { cache } from 'react';

import prisma from 'lib/prisma';

import type { Tag } from '@prisma/client';

export const getTags = cache(async (tenantId: string): Promise<Tag[]> => {
  try {
    if (!tenantId) {
      throw new Error('Tenant not found');
    }
    const tags = await prisma.tag.findMany({
      where: { tenantId },
    });
    if (!tags) return [];
    return tags;
  } catch (error) {
    throw new Error('Error fetching tags');
  }
});
