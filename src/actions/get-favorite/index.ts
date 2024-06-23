import { cache } from 'react';

import { Favorite } from '@prisma/client';
import prisma from 'lib/prisma';

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
    } catch (error) {
      throw new Error('Error fetching favorite');
    }
  },
);
