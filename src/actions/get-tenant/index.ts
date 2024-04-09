import { cache } from 'react';

import prisma from 'lib/prisma';
import 'server-only';

export const getTenant = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'User not found' };
    }
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return null;

    return tenant;
  } catch (error) {
    return { error: 'Error fetching tenant' };
  }
});
