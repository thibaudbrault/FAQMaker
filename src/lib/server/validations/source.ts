import { z } from 'zod';

export const sourceGetSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  label: z.string(),
  link: z.string().url(),
  answerId: z.string().cuid(),
});
