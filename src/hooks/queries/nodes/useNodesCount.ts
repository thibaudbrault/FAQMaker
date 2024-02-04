import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getNodesCount } from '@/lib';
import { QueryKeys } from '@/utils';

export const useNodesCount = (tenantId: string) => {
  const query = useQuery<number, AxiosError>({
    queryKey: [QueryKeys.NODES_COUNT, tenantId],
    queryFn: () => getNodesCount(tenantId),
  });
  return query;
};
