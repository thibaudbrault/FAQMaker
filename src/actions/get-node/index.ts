import { cache } from 'react';

import { redirect } from 'next/navigation';

import { Routes, nodeModel } from '@/utils';
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
    } catch (error) {
      throw new Error('Error fetching node');
    }
  },
);
