import { cache } from 'react';

import prisma from 'lib/prisma';

import type { Favorite } from '@prisma/client';

export const getFavorite = cache(
  async (userId: string, nodeId: string): Promise<Favorite> => {
    try {
      if (!nodeId) {
        throw new Error('Node not found');
      }
      const favorite = await prisma.favorite.findFirst({
        where: { nodeId: nodeId as string, userId: userId as string },
        select: {
          nodeId: true,
        },
      });
      return favorite as Favorite;
    } catch {
      throw new Error('Error fetching favorite');
    }
  },
);
