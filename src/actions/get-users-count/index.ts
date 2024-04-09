import { cache } from 'react';

import prisma from 'lib/prisma';
import 'server-only';

export const getUsersCount = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'Tenant not found' };
    }
    const users = await prisma.user.count({
      where: { tenantId },
    });

    if (!users) return 0;

    return users;
  } catch (error) {
    return { error: 'Error fetching users count' };
  }
});
