import { z } from 'zod';

export const getTenantIdSchema = z.object({
  tenantId: z.string(),
});

export const getNodeIdSchema = z.object({
  nodeId: z.string(),
});

export const getUserIdSchema = z.object({
  userId: z.string(),
});
