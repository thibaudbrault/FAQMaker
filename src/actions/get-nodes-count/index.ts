'use server';

import { cache } from 'react';

import prisma from 'lib/prisma';
import 'server-only';

export const preload = (tenantId: string) => {
  void getNodesCount(tenantId);
};

export const getNodesCount = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'Tenant not found' };
    }
    const nodes = await prisma.node.count({
      where: { tenantId },
    });

    if (!nodes) return 0;

    return nodes;
  } catch (error) {
    return { error: 'Error fetching nodes count' };
  }
});
