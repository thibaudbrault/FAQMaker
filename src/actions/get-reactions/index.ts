import { cache } from 'react';

import prisma from 'lib/prisma';

import type { Reaction } from '@prisma/client';

export const getReactions = cache(
  async (nodeId: string): Promise<Reaction[]> => {
    try {
      if (!nodeId) {
        throw new Error('Node not found');
      }
      const reactions = await prisma.reaction.findMany({
        where: { nodeId },
      });
      if (!reactions) return [];
      return reactions;
    } catch (error) {
      throw new Error('Error fetching reactions');
    }
  },
);
