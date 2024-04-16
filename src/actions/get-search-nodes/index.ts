import { cache } from 'react';

import { ExtendedNode } from '@/types';
import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getSearchSchema } from './schema';

export const getSearchNodes = cache(
  async (tenantId, query): Promise<ExtendedNode[]> => {
    try {
      if (!tenantId) {
        throw new Error('Tenant not found');
      }
      if (!query) {
        return [];
      }
      const result = getSearchSchema.safeParse({ tenantId, query });
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        throw new Error('Invalid request' + errors);
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
        return nodes as ExtendedNode[];
      }
    } catch (error) {
      throw new Error('Error fetching results');
    }
  },
);
