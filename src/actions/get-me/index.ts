'use server';

import { cache } from 'react';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import type { Me } from '@/types';
import type { Session } from 'next-auth';

export const getMe = cache(async (): Promise<Me | null> => {
  const session = await auth();
  if (!session) redirect(Routes.SITE.LOGIN);
  const id = session.user?.id;
  if (!id) {
    throw new Error('User ID not found');
  }
  const me = await prisma.user.findUnique({
    where: { id },
    include: { tenant: { select: { company: true, logo: true } } },
  });
  if (!me) {
    return null;
  }
  return me as Me;
});

export const getUserId = cache(
  async (session: Session): Promise<string | null> => {
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
  },
);
