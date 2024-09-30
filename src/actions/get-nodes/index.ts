import { cache } from 'react';

import { OFFSET, nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getNodesSchema } from './schema';

import type { ExtendedNode } from '@/types';

type Props = {
  tenantId: string;
  page: number;
};

export const getPaginatedNodes = cache(
  async (body: Props): Promise<ExtendedNode[]> => {
    try {
      if (!body) {
        throw new Error('Tenant not found');
      }
      const result = getNodesSchema.safeParse(body);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        throw new Error(`Invalid request${errors}`);
      } else {
        const { tenantId, page } = result.data;
        const nodes = await prisma.node.findMany({
          where: { tenantId: tenantId as string },
          orderBy: [
            {
              isPinned: 'desc',
            },
            {
              createdAt: 'desc',
            },
          ],
          skip: page * OFFSET,
          take: OFFSET,
          include: nodeModel,
        });
        if (!nodes) return [];
        return nodes as ExtendedNode[];
      }
    } catch {
      throw new Error('Error fetching nodes');
    }
  },
);

export const getAllNodes = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      throw new Error('Tenant not found');
    }
    const nodes = await prisma.node.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: nodeModel,
    });

    if (!nodes) return null;

    return nodes;
  } catch {
    throw new Error('Error fetching nodes');
  }
});
