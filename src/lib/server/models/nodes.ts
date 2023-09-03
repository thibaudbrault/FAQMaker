import prisma from 'lib/prisma';

export const getNodes = async (tenantId: string) => {
  const nodes = await prisma.node.findMany({
    where: { tenantId },
  });

  if (!nodes) return null;

  return nodes;
};

export const getNode = async ({ tenantId, id }) => {
  const node = await prisma.node.findUnique({
    where: { id, tenantId },
  });
};
