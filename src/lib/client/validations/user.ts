import { z } from 'zod';

export const createUserClientSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' }),
  role: z.enum(['user', 'admin']),
});
