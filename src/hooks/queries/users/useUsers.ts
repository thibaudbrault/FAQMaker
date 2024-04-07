import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/actions';
import { QueryKeys } from '@/utils';

export const useUsers = (tenantId: string) => {
  return useQuery({
    queryKey: [QueryKeys.USERS, tenantId],
    queryFn: async () => getUsers(tenantId),
  });
};
