import { nodeModel, nodeModelWithDate } from '@/utils';
import prisma from 'lib/prisma';

export const getNodes = async (tenantId: string) => {
  const nodes = await prisma.node.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    include: nodeModel,
  });

  if (!nodes) return null;

  return nodes;
};

export const getNodesCount = async (tenantId: string) => {
  const nodes = await prisma.node.count({
    where: { tenantId },
  });

  if (!nodes) return 0;

  return nodes;
};

export const getNode = async (tenantId: string, id: string) => {
  const node = await prisma.node.findUnique({
    where: { id, tenantId },
    include: nodeModelWithDate,
  });

  if (!node) return null;

  return node;
};
