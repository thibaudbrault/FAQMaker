import { useQuery } from '@tanstack/react-query';

import { getSearchNodes } from '@/actions';
import { QueryKeys } from '@/utils';

export const useSearchNodes = (tenantId: string, searchQuery: string) => {
  return useQuery({
    queryKey: [QueryKeys.SEARCH, tenantId, searchQuery],
    queryFn: async () => getSearchNodes(tenantId, searchQuery),
    enabled: !!searchQuery,
  });
};
