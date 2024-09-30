import { z } from 'zod';

export const getNodesSchema = z.object({
  tenantId: z.string(),
  page: z.number(),
});
