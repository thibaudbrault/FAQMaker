import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { QueryKeys } from '@/utils';
import prisma from 'lib/prisma';

const getNodesCount = async (tenantId: string) => {
  const nodes = await prisma.node.count({
    where: { tenantId },
  });

  if (!nodes) return null;

  return nodes;
};

export const useNodesCount = (tenantId: string) => {
  const query = useQuery<number, AxiosError>({
    queryKey: [QueryKeys.NODES_COUNT, tenantId],
    queryFn: () => getNodesCount(tenantId),
  });
  return query;
};
