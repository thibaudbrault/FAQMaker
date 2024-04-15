import { z } from 'zod';

const ROLE = ['user', 'admin', 'tenant'] as const;

export const createUserSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email' }),
  role: z.enum(ROLE),
  tenantId: z.string().cuid2(),
  usersCount: z.number().min(0),
});
