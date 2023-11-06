import prisma from 'lib/prisma';

export const getUserAnswers = async (id: string) => {
  const answers = await prisma.node.findMany({
    where: { answer: { is: { userId: id } } },
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

  if (!answers) return null;

  return answers;
};
