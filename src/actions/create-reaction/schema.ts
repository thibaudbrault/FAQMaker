import { z } from 'zod';

export const createReactionSchema = z.object({
  nodeId: z.string().cuid2(),
  shortcode: z.string(),
});
