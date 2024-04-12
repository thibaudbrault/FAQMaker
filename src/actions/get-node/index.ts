import { cache } from 'react';

import { redirect } from 'next/navigation';

import { Routes, nodeModelWithDate } from '@/utils';
import prisma from 'lib/prisma';

export const getNode = cache(async (tenantId, id: string) => {
  try {
    if (!id) {
      throw new Error('Node not found');
    }
    const node = await prisma.node.findUnique({
      where: { id: id as string, tenantId: tenantId as string },
      include: nodeModelWithDate,
    });
    if (!node) return redirect(Routes.SITE.HOME);
    return node;
  } catch (error) {
    throw new Error('Error fetching node');
  }
});
