import { z } from 'zod';

export const sourceGetSchema = z.object({
  id: z.string().cuid2(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  label: z.string(),
  link: z.string().url(),
  answerId: z.string().cuid2(),
});
