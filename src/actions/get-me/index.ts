'use server';

import { cache } from 'react';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from 'lib/prisma';

import type { Me } from '@/types';
import type { Session } from 'next-auth';

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
  } catch {
    throw new Error('Error fetching user');
  }
});

export const getUserId = cache(
  async (session: Session): Promise<string | null> => {
    try {
      const id = session?.user?.id;
      if (!id) {
        throw new Error('ID not found');
      }
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
        },
      });
      const userId = user?.id ?? null;
      return userId as string;
    } catch {
      throw new Error('Error fetching user');
    }
  },
);
