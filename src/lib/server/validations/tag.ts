import { z } from 'zod';

export const tagGetSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  nodeId: z.string().uuid(),
  tenantId: z.string().uuid(),
});
