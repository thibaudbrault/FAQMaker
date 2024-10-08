import { z } from 'zod';

export const updateAnswerSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Answer is required' })
    .max(1000, { message: 'Answer must be under 1000 characters long' }),
  id: z.string().cuid2(),
});
