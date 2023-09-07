import prisma from 'lib/prisma';

export const getUserQuestions = async (id: string) => {
  const nodes = await prisma.question.findMany({
    where: { userId: id },
    include: { node: { select: { id: true } } },
  });

  if (!nodes) return null;

  return nodes;
};
