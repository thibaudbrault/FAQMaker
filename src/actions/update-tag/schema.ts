import { z } from 'zod';

export const updateTagSchema = z.object({
  id: z.string().cuid2(),
  label: z
    .string()
    .trim()
    .min(1, { message: 'Tag name is required' })
    .max(50, { message: 'Tag name is too long' }),
  tenantId: z.string().cuid2(),
});
