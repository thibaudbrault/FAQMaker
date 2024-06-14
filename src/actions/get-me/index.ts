import { cache } from 'react';

import { auth } from '@/auth';

import prisma from 'lib/prisma';

import type { Me } from '@/types';

export const getMe = cache(async (): Promise<Me | null> => {
  try {
    const session = await auth();
    if (!session) {
      return null;
    }
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
