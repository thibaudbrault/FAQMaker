import prisma from 'lib/prisma';

export const getNodes = async (tenantId: string) => {
  const nodes = await prisma.node.findMany({
    where: { tenantId },
    include: {
      question: {
        select: {
          id: true,
          text: true,
          slug: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      answer: {
        select: {
          text: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      tags: {
        select: {
          label: true,
        },
      },
    },
  });

  if (!nodes) return null;

  return nodes;
};

export const getNode = async (tenantId: string, id: string) => {
  const node = await prisma.node.findUnique({
    where: { id, tenantId },
    include: {
      question: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          text: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      answer: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          text: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      tags: {
        select: {
          id: true,
          label: true,
        },
      },
    },
  });

  if (!node) return null;

  return node;
};
