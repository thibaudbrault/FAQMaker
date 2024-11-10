import { cache } from 'react';

import { ExtendedNode } from '@/types/models/node';
import { nodeModel } from '@/utils/models';
import prisma from 'lib/prisma';

import { getTagSearchSchema } from './schema';

export const getSearchTags = cache(
  async (tenantId, tag): Promise<ExtendedNode[]> => {
    try {
      if (!tenantId) {
        throw new Error('Tenant not found');
      }
      if (!tag) {
        return [];
      }
      const result = getTagSearchSchema.safeParse({ tenantId, tag });
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        throw new Error(`Invalid request${errors}`);
      } else {
        const validatedData = result.data;
        const nodes = await prisma.node.findMany({
          where: {
            tenantId: validatedData.tenantId as string,
            tags: {
              some: {
                label: {
                  contains: validatedData.tag as string,
                  mode: 'insensitive',
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          include: nodeModel,
        });
        if (!nodes) return [];
        return nodes as ExtendedNode[];
      }
    } catch {
      throw new Error('Error fetching results');
    }
  },
);
