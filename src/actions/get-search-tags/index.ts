import { cache } from 'react';

import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getTagSearchSchema } from './schema';

type Props = {
  tenantId: string;
  searchTag: string;
};

export const getSearchTags = cache(async (body: Props) => {
  try {
    if (!body) {
      return { error: 'Tenant not found' };
    }
    const result = getTagSearchSchema.safeParse(body);
    if (result.success === false) {
      const errors = result.error.formErrors.fieldErrors;
      return { error: 'Invalid request' + errors };
    } else {
      const { tenantId, searchTag } = result.data;
      const nodes = await prisma.node.findMany({
        where: {
          tenantId: tenantId as string,
          tags: {
            some: {
              label: { contains: searchTag as string, mode: 'insensitive' },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        include: nodeModel,
      });
      return nodes;
    }
  } catch (error) {
    return { error: 'Error when looking for results' };
  }
});
