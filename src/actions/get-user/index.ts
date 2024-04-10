import { cache } from 'react';

import prisma from 'lib/prisma';

export const getUser = cache(async (id: string) => {
  try {
    if (!id) {
      return { error: 'User not found' };
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    return { error: 'Error fetching user' };
  }
});
