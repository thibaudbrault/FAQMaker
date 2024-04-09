import { cache } from 'react';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from 'lib/prisma';

export const getMe = cache(async () => {
  try {
    const session = await getServerSession(authOptions);
    const id = session?.user?.id;
    if (!id) return null;
    const me = await prisma.user.findUnique({
      where: { id },
      include: { tenant: { select: { company: true, logo: true } } },
    });
    if (!me) return null;
    return me;
  } catch (error) {
    return { error: 'Error fetching user' };
  }
});
