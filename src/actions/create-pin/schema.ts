import { z } from 'zod';

export const createPinSchema = z.object({
  nodeId: z.string().cuid2(),
  tenantId: z.string().cuid2(),
});
