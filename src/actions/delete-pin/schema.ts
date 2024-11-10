import { z } from 'zod';

export const deletePinSchema = z.object({
  nodeId: z.string().cuid2(),
  tenantId: z.string().cuid2(),
});
