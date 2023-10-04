import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getUser = async (id: string) => {
  const { data } = await axios.get(`${Routes.API.USERS}/${id}`);
  return data;
};

export const useUser = (id: string) => {
  const query = useQuery<User, AxiosError>({
    queryKey: [QueryKeys.USER, id],
    queryFn: () => getUser(id),
  });
  return query;
};
