import { z } from 'zod';

import { sourceGetSchema } from './source';

export const answerGetSchema = z.object({
  id: z.string().cuid2(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  text: z.string(),
  sources: z.array(sourceGetSchema),
  nodeId: z.string().cuid2(),
});

export const answerCreateSchema = z.object({
  text: z.string().min(3),
  nodeId: z.string(),
  userId: z.string(),
});
