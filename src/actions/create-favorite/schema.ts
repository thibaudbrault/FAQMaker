import { z } from 'zod';

export const createFavoriteSchema = z.object({
  nodeId: z.string().cuid2(),
});
