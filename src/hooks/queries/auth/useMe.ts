import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

import { QueryKeys, Routes } from '@/utils';
import { User } from '@prisma/client';

const getUser = async (id: string | undefined) => {
  if (!id) return null;
  const { data } = await axios.get<User>(`${Routes.API.USERS}/${id}`);
  return data;
};

export const useMe = () => {
  const { data: session, status } = useSession();
  const id: string = session?.user?.id;
  const query = useQuery<User | null, AxiosError>({
    queryKey: [QueryKeys.ME, id],
    queryFn: () => getUser(id),
    enabled: status !== 'loading',
  });
  return query;
};
