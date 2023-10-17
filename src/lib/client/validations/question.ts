import { z } from 'zod';

export const questionGetSchema = z.object({
  id: z.string().cuid2(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  text: z.string(),
  slug: z.string(),
});

export const questionCreateClientSchema = z.object({
  text: z
    .string()
    .min(3, { message: 'Question must be at least 3 characters long' }),
});

export const questionUpdateClientSchema = z.object({
  text: z
    .string()
    .min(3, { message: 'Question must be at least 3 characters long' }),
});
