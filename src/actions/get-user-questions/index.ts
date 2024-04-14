import { cache } from 'react';

import { QuestionWithNodeId } from '@/types';
import prisma from 'lib/prisma';

export const getUserQuestions = cache(
  async (userId: string): Promise<QuestionWithNodeId[]> => {
    try {
      if (!userId) {
        throw new Error('User not found');
      }
      const questions = await prisma.question.findMany({
        where: { userId: userId as string },
        orderBy: { createdAt: 'desc' },
        include: { node: { select: { id: true } } },
      });

      if (!questions) return [];

      return questions;
    } catch (error) {
      throw new Error('Error fetching questions');
    }
  },
);
