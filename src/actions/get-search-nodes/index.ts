import { cache } from 'react';

import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getSearchSchema } from './schema';

import type { ExtendedNode } from '@/types';

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
        throw new Error(`Invalid request${errors}`);
      } else {
        const validatedData = result.data;
        const nodes = await prisma.node.findMany({
          where: {
            tenantId: validatedData.tenantId as string,
            question: {
              text: {
                contains: validatedData.query as string,
                mode: 'insensitive',
              },
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
