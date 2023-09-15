import { z } from 'zod';

export const tagGetSchema = z.object({
  id: z.string().cuid(),
  label: z.string(),
  nodeId: z.string().cuid(),
  tenantId: z.string().cuid(),
});
