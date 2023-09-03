import { z } from 'zod';
import { sourceGetSchema } from './source';

export const answerGetSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  text: z.string(),
  sources: z.array(sourceGetSchema),
  nodeId: z.string().cuid(),
});

export const answerCreateSchema = z.object({
  text: z.string().min(3),
  nodeId: z.string(),
  userId: z.string(),
});
