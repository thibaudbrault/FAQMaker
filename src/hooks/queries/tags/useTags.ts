import { useQuery } from '@tanstack/react-query';

import { getTags } from '@/actions';
import { QueryKeys } from '@/utils';

export const useTags = (tenantId: string) => {
  return useQuery({
    queryKey: [QueryKeys.TAGS, tenantId],
    queryFn: async () => getTags(tenantId),
  });
};
