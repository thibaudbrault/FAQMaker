import { GetSessionParams, getSession } from 'next-auth/react';

import prisma from 'lib/prisma';
import { User } from '@prisma/client';

export const getMe = async (params: GetSessionParams): Promise<User | null> => {
  const session = await getSession(params);
  const id = session?.user?.id;

  if (!id) return null;

  const me = await prisma.user.findUnique({
    where: { id },
    include: { tenant: { select: { company: true } } },
  });

  if (!me) return null;

  return me;
};

export const getUsersCount = async (tenantId: string) => {
  const users = await prisma.user.count({
    where: { tenantId },
  });

  if (!users) return null;

  return users;
};
