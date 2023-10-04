import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ClientUser } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getUsers = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.USERS, { params: { tenantId } });
  return data;
};

export const useUsers = (tenantId: string) => {
  const query = useQuery<ClientUser[], AxiosError>({
    queryKey: [QueryKeys.USERS, tenantId],
    queryFn: () => getUsers(tenantId),
  });
  return query;
};
