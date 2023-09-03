import { ClientUser } from '@/types';
import prisma, { excludeFromUser } from 'lib/prisma';
import { GetSessionParams, getSession } from 'next-auth/react';

export const getMe = async (
  params: GetSessionParams,
): Promise<ClientUser | null> => {
  const session = await getSession(params);
  const id = session?.user?.id;

  if (!id) return null;

  const me = await prisma.user.findUnique({
    where: { id },
    include: { tenant: { select: { company: true } } },
  });

  if (!me) return null;

  return excludeFromUser(me);
};
