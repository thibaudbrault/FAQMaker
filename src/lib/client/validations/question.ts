import { z } from 'zod';

export const questionClientSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' }),
});
