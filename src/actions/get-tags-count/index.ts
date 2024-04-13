import { cache } from 'react';

import prisma from 'lib/prisma';

export const getTagsCount = cache(async (tenantId: string): Promise<number> => {
  try {
    if (!tenantId) {
      throw new Error('Tenant not found');
    }
    const tags = await prisma.tag.count({
      where: { tenantId },
    });

    if (!tags) return 0;

    return tags;
  } catch (error) {
    throw new Error('Error fetching tags count');
  }
});
