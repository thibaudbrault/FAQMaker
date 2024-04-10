import { cache } from 'react';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Me } from '@/types';
import prisma from 'lib/prisma';

export const getMe = cache(async (): Promise<Me | null> => {
  try {
    const session = await getServerSession(authOptions);
    const id = session?.user?.id;
    if (!id) {
      throw new Error('ID not found');
    }
    const me = await prisma.user.findUnique({
      where: { id },
      include: { tenant: { select: { company: true, logo: true } } },
    });
    if (!me) {
      return null;
    }
    return me as Me;
  } catch (error) {
    throw new Error('Error fetching user');
  }
});
