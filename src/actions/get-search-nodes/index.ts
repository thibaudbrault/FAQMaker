import { cache } from 'react';

import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getSearchSchema } from './schema';

export const getSearchNodes = cache(async (tenantId, query) => {
  try {
    if (!tenantId) {
      return { error: 'Tenant not found' };
    }
    if (!query) {
      return [];
    }
    const result = getSearchSchema.safeParse({ tenantId, query });
    if (result.success === false) {
      const errors = result.error.formErrors.fieldErrors;
      return { error: 'Invalid request' + errors };
    } else {
      const { tenantId, query } = result.data;
      const nodes = await prisma.node.findMany({
        where: {
          tenantId: tenantId as string,
          question: {
            text: { contains: query as string, mode: 'insensitive' },
          },
        },
        orderBy: { createdAt: 'desc' },
        include: nodeModel,
      });
      if (!nodes) return [];
      return nodes;
    }
  } catch (error) {
    return { error: 'Error when looking for results' };
  }
});
