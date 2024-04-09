import { cache } from 'react';

import { OFFSET, nodeModel } from '@/utils';
import prisma from 'lib/prisma';

import { getNodesSchema } from './schema';
import 'server-only';

type Props = {
  tenantId: string;
  page: number;
};

export const getPaginatedNodes = cache(async (body: Props) => {
  try {
    if (!body) {
      return { error: 'Tenant not found' };
    }
    const result = getNodesSchema.safeParse(body);
    if (result.success === false) {
      const errors = result.error.formErrors.fieldErrors;
      return { error: 'Invalid request' + errors };
    } else {
      const { tenantId, page } = result.data;
      const nodes = await prisma.node.findMany({
        where: { tenantId: tenantId as string },
        orderBy: { createdAt: 'desc' },
        skip: page * OFFSET,
        take: OFFSET,
        include: nodeModel,
      });
      return nodes;
    }
  } catch (error) {
    return { error: 'Error fetching nodes' };
  }
});

export const getAllNodes = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'Tenant not found' };
    }
    const nodes = await prisma.node.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: nodeModel,
    });

    if (!nodes) return null;

    return nodes;
  } catch (error) {
    return { error: 'Error fetching nodes' };
  }
});
