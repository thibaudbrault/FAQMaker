import { z } from 'zod';

export const questionGetSchema = z.object({
  id: z.string().cuid2(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  text: z.string(),
  slug: z.string(),
});

export const questionCreateServerSchema = z.object({
  text: z.string().min(3),
  slug: z.string(),
  tenantId: z.string().cuid2(),
  userId: z.string().cuid2(),
  tags: z.array(z.string().cuid2()),
  withAnswer: z.boolean().optional()
});
