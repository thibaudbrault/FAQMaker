import { z } from 'zod';

export const createAnswerServerSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Answer is required' })
    .max(1000, { message: 'Answer must be under 1000 characters long' }),
  nodeId: z.string().cuid2(),
  userId: z.string().cuid2(),
});

export const updateAnswerServerSchema = z.object({
  body: z.object({
    text: z
      .string()
      .trim()
      .min(1, { message: 'Answer is required' })
      .max(1000, { message: 'Answer must be under 1000 characters long' }),
    userId: z.string().cuid2(),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});
