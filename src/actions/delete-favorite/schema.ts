import { z } from 'zod';

export const deleteFavoriteSchema = z.object({
  nodeId: z.string().cuid2(),
});
