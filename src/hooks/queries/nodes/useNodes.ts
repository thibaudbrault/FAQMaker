import { useQuery } from '@tanstack/react-query';

import { getPaginatedNodes } from '@/actions';
import { QueryKeys } from '@/utils';

export const useNodes = (tenantId: string, page: number) => {
  const body = { tenantId, page };
  return useQuery({
    queryKey: [QueryKeys.NODES, tenantId, page],
    queryFn: async () => getPaginatedNodes(body),
  });
};
