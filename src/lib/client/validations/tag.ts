import { z } from 'zod';

export const tagGetSchema = z.object({
  id: z.string().cuid2(),
  label: z.string(),
  nodeId: z.string().cuid2(),
  tenantId: z.string().cuid2(),
});
