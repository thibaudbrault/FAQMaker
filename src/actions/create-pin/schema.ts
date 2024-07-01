import { z } from 'zod';

export const createPinSchema = z.object({
  nodeId: z.string().cuid2(),
});
