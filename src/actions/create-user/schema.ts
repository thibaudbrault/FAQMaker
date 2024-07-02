import { z } from 'zod';

import { Limits, ROLE } from '@/utils';

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .max(Limits.EMAIL, { message: 'Email is too long' })
    .email({ message: 'Invalid email' }),
  role: z.enum(ROLE),
  tenantId: z.string().cuid2(),
  usersCount: z.number().min(0),
});
