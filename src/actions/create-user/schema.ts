import { z } from 'zod';

import { ROLE } from '@/utils';

export const createUserSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email' }),
  role: z.enum(ROLE),
  tenantId: z.string().cuid2(),
  usersCount: z.number().min(0),
});
