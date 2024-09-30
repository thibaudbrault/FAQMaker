import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { QueryKeys, Routes } from '@/utils';

const getUser = async (id: string | undefined) => {
  if (!id) return null;
  const { data } = await axios.get<User>(`${Routes.API.USERS.INDEX}/${id}`);
  return data;
};

export const useMe = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const id: string = session?.user?.id;
  const query = useQuery<User | null, AxiosError>({
    queryKey: [QueryKeys.ME, id],
    queryFn: () => getUser(id),
    enabled: status !== 'loading',
  });
  return query;
};
