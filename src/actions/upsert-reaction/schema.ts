import { z } from 'zod';

export const upsertReactionSchema = z.object({
  nodeId: z.string().cuid2(),
  shortcode: z.string(),
});
