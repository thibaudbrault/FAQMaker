import { z } from 'zod';

export const updateTenantSchema = z.object({
  company: z.string().trim().min(1, { message: 'Company name is required' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email' }),
  id: z.string().cuid2(),
});
