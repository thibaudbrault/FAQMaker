import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getUsersCount = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.USERS.COUNT, {
    params: { tenantId },
  });
  return data;
};

export const useUsersCount = (tenantId: string) => {
  const query = useQuery<number, AxiosError>({
    queryKey: [QueryKeys.USERS_COUNT, tenantId],
    queryFn: () => getUsersCount(tenantId),
  });
  return query;
};
