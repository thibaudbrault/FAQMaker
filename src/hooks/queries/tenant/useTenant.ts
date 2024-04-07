import { useQuery } from '@tanstack/react-query';

import { getTenant } from '@/actions';
import { QueryKeys } from '@/utils';

export const useTenant = (tenantId: string) => {
  return useQuery({
    queryKey: [QueryKeys.TENANT, tenantId],
    queryFn: async () => getTenant(tenantId),
  });
};
