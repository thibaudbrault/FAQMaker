import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getUsers = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.USERS.INDEX, {
    params: { tenantId },
  });
  return data;
};

export const useUsers = (tenantId: string) => {
  const query = useQuery<User[], AxiosError>({
    queryKey: [QueryKeys.USERS, tenantId],
    queryFn: () => getUsers(tenantId),
  });
  return query;
};
