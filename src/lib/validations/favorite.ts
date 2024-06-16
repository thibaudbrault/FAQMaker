import { z } from 'zod';

export const favoriteClientSchema = z.object({
  userId: z.string().cuid2(),
  nodeId: z.string().cuid2(),
});
