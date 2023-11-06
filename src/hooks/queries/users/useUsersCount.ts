import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getUsersCount } from '@/lib';
import { QueryKeys } from '@/utils';

export const useUsersCount = (tenantId: string) => {
  const query = useQuery<number, AxiosError>({
    queryKey: [QueryKeys.USERS_COUNT, tenantId],
    queryFn: () => getUsersCount(tenantId),
  });
  return query;
};
