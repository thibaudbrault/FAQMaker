import { useQuery } from '@tanstack/react-query';

import { getNodesCount } from '@/actions';
import { QueryKeys } from '@/utils';

export const useNodesCount = (tenantId: string) => {
  return useQuery({
    queryKey: [QueryKeys.NODES_COUNT, tenantId],
    queryFn: async () => getNodesCount(tenantId),
  });
};
