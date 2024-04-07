'use server';

import { cache } from 'react';

import prisma from 'lib/prisma';

export const getUsers = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'User not found' };
    }
    const users = await prisma.user.findMany({
      where: { tenantId },
    });
    return users;
  } catch (error) {
    if (error instanceof Error) {
      return { error: 'Error fetching users' };
    }
  }
});
