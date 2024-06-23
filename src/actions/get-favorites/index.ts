import { cache } from 'react';

import prisma from 'lib/prisma';

import type { ExtendedFavorite } from '@/types';

export const getFavorites = cache(
  async (userId: string): Promise<ExtendedFavorite[]> => {
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

      return favorites;
    } catch (error) {
      throw new Error('Error fetching favorites');
    }
  },
);
