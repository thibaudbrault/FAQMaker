'use server';

import { cache } from 'react';

import prisma from 'lib/prisma';

export const getTags = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'Tenant not found' };
    }
    const tags = await prisma.tag.findMany({
      where: { tenantId },
    });

    if (!tags) return null;

    return tags;
  } catch (error) {
    return { error: 'Error fetching tags' };
  }
});
