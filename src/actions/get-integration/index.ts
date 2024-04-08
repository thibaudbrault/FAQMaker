'use server';

import { cache } from 'react';

import prisma from 'lib/prisma';
import 'server-only';

export const preload = (tenantId: string) => {
  void getIntegration(tenantId);
};

export const getIntegration = cache(async (tenantId: string) => {
  try {
    if (!tenantId) {
      return { error: 'Tenant not found' };
    }
    const integrations = await prisma.integrations.findUnique({
      where: { tenantId },
    });

    if (!integrations) return null;

    return integrations;
  } catch (error) {
    return { error: 'Error fetching integrations' };
  }
});
