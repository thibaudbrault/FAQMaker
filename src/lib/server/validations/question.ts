import { z } from 'zod';

export const questionGetSchema = z.object({
  id: z.string().cuid2(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  text: z.string(),
  slug: z.string(),
});

export const questionCreateSchema = z.object({
  text: z.string().min(3),
  slug: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  tags: z.array(z.string().cuid2()),
});
