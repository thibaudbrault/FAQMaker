import { z } from 'zod';

import { Limits } from '@/utils';

export const updateTenantSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, { message: 'Company name is required' })
    .max(Limits.COMPANY, { message: 'Company name is too long' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .max(Limits.EMAIL, { message: 'Email is too long' })
    .email({ message: 'Invalid email' }),
  slack: z.union([
    z.literal(''),
    z.string().trim().url({ message: 'Invalid URL' }),
  ]),
  id: z.string().cuid2(),
});
