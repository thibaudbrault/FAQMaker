import { z } from 'zod';

import { ROLE } from '@/utils';

export const updateUserSchema = z.object({
  tenantId: z.string().cuid2(),
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' }),
  name: z.string().trim().optional(),
  role: z.enum(ROLE),
  id: z.string().cuid2(),
});
