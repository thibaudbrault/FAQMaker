import { z } from 'zod';

export const createAnswerServerSchema = z.object({
  text: z.string().trim().min(1, { message: 'Answer is required' }),
  nodeId: z.string().cuid2(),
  userId: z.string().cuid2(),
});

export const updateAnswerServerSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1, { message: 'Answer is required' }),
    userId: z.string().cuid2(),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});
