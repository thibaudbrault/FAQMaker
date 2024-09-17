import { cache } from 'react';

import prisma from 'lib/prisma';

import type { NodeWithQuestionAndAnswer } from '@/types';

export const getUserAnswers = cache(
  async (userId: string): Promise<NodeWithQuestionAndAnswer[]> => {
    try {
      if (!userId) {
        throw new Error('User not found');
      }
      const answers = await prisma.node.findMany({
        where: { answer: { is: { userId } } },
        include: {
          answer: {
            select: {
              text: true,
              updatedAt: true,
            },
          },
          question: {
            select: {
              id: true,
              slug: true,
              text: true,
            },
          },
        },
      });
      if (!answers) return [];
      return answers as NodeWithQuestionAndAnswer[];
    } catch {
      throw new Error('Error fetching answers');
    }
  },
);
