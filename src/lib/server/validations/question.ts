import { z } from 'zod';

export const questionGetSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  text: z.string(),
  slug: z.string(),
});

export const questionCreateSchema = z.object({
  text: z.string().min(3),
  slug: z.string(),
  tenantId: z.string(),
  userId: z.string(),
});
