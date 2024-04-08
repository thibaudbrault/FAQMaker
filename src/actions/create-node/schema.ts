import { z } from 'zod';

export const createNodeSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' })
    .max(100, { message: 'Question must be under 100 characters long' }),
  slug: z.string(),
  tenantId: z.string().cuid2(),
  userId: z.string().cuid2(),
  tags: z.array(z.string().cuid2()),
  withAnswer: z.boolean().optional(),
});
