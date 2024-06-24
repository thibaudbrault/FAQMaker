import { cache } from 'react';

import prisma from 'lib/prisma';

import type { ExtendedFavorites } from '@/types';

export const getFavorites = cache(
  async (userId: string): Promise<ExtendedFavorites[]> => {
    try {
      if (!userId) {
        throw new Error('User not found');
      }
      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          node: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!favorites) return [];

      return favorites as ExtendedFavorites[];
    } catch (error) {
      throw new Error('Error fetching favorites');
    }
  },
);
