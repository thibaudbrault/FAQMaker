import { z } from 'zod';

export const createFavoriteSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Answer is required' })
    .max(1000, { message: 'Answer must be under 1000 characters long' }),
  nodeId: z.string().cuid2(),
  userId: z.string().cuid2(),
});
