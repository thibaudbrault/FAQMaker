import { z } from 'zod';

export const createReactionSchema = z.object({
  nodeId: z.string().cuid2(),
  reaction: z.string(),
});
