import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { QueryKeys } from '@/utils';
import prisma from 'lib/prisma';

const getUsersCount = async (tenantId: string) => {
  const users = await prisma.user.count({
    where: { tenantId },
  });

  if (!users) return null;

  return users;
};

export const useUsersCount = (tenantId: string) => {
  const query = useQuery<number, AxiosError>({
    queryKey: [QueryKeys.USERS_COUNT, tenantId],
    queryFn: () => getUsersCount(tenantId),
  });
  return query;
};
