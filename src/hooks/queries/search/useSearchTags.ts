import { useQuery } from '@tanstack/react-query';

import { getSearchTags } from '@/actions';
import { QueryKeys } from '@/utils';

export const useSearchTags = (tenantId: string, searchTag: string) => {
  const body = { tenantId, searchTag };
  return useQuery({
    queryKey: [QueryKeys.SEARCH, tenantId, searchTag],
    queryFn: async () => getSearchTags(body),
    enabled: !!searchTag,
  });
};
