import { cache } from 'react';

import { NodeWithQuestionAndAnswer } from '@/types';
import prisma from 'lib/prisma';

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

      return answers;
    } catch (error) {
      throw new Error('Error fetching answers');
    }
  },
);
