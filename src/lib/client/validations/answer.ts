import { z } from 'zod';

export const answerClientSchema = z.object({
  text: z.string().trim().min(1, { message: 'Answer must be provided' }),
});
