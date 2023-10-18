import prisma from 'lib/prisma';

export const getUserQuestions = async (id: string) => {
  const questions = await prisma.question.findMany({
    where: { userId: id },
    include: { node: { select: { id: true } } },
  });

  if (!questions) return null;

  return questions;
};
