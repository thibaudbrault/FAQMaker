import { cache } from 'react';

import { nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getSearchSchema } from './schema';

type Props = {
  tenantId: string;
  searchQuery: string;
};

export const getSearchNodes = cache(async (body: Props) => {
  try {
    if (!body) {
      return { error: 'Tenant not found' };
    }
    const result = getSearchSchema.safeParse(body);
    if (result.success === false) {
      const errors = result.error.formErrors.fieldErrors;
      return { error: 'Invalid request' + errors };
    } else {
      const { tenantId, searchQuery } = result.data;
      const nodes = await prisma.node.findMany({
        where: {
          tenantId: tenantId as string,
          question: {
            text: { contains: searchQuery as string, mode: 'insensitive' },
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
