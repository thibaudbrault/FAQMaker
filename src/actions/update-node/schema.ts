import { z } from 'zod';

export const updateNodeSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' })
    .max(100, { message: 'Question must be under 100 characters long' }),
  userId: z.string().cuid2(),
  questionId: z.string().cuid2(),
  tenantId: z.string().cuid2(),
  tags: z.array(z.string().cuid2()),
  id: z.string().cuid2(),
});
