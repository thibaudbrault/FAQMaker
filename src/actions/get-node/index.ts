import { cache } from 'react';

import { redirect } from 'next/navigation';

import { nodeModel } from '@/utils/models';
import { Routes } from '@/utils/routing';
import prisma from 'lib/prisma';

import type { ExtendedNode } from '@/types';

export const getNode = cache(
  async (tenantId, id: string): Promise<ExtendedNode> => {
    try {
      if (!id) {
        throw new Error('Node not found');
      }
      const node = await prisma.node.findUnique({
        where: { id: id as string, tenantId: tenantId as string },
        include: nodeModel,
      });
      if (!node) return redirect(Routes.SITE.HOME);
      return node as ExtendedNode;
    } catch {
      throw new Error('Error fetching node');
    }
  },
);
