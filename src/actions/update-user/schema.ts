import { z } from 'zod';

import { ROLE } from '@/utils/constants';
import { Limits } from '@/utils/limits';

export const updateUserSchema = z.object({
  tenantId: z.string().cuid2(),
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .max(Limits.EMAIL, { message: 'Email is too long' })
    .email({ message: 'Invalid email' })
    .optional(),
  name: z
    .string()
    .trim()
    .max(Limits.NAME, { message: 'Name is too long' })
    .optional(),
  role: z.enum(ROLE).optional(),
  id: z.string().cuid2(),
});
