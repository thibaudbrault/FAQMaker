import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

import { ClientUser } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getUser = async (id: string | undefined) => {
  if (!id) return null;
  const { data } = await axios.get<ClientUser>(`${Routes.API.USERS}/${id}`);
  return data;
};

export const useMe = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;
  const query = useQuery<ClientUser | null, AxiosError>({
    queryKey: [QueryKeys.ME, id],
    queryFn: () => getUser(id),
    enabled: status !== 'loading',
  });
  return query;
};
