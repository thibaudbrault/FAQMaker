import { z } from 'zod';

export const tenantGetSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  plan: z.enum(['free', 'paid']),
  company: z.string(),
  color: z.string().optional(),
});
