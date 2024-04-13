import { z } from 'zod';

export const createTagSchema = z.object({
  label: z.string().trim().min(1, { message: 'Tag name is required' }),
  tenantId: z.string().cuid2(),
  plan: z.enum(['free', 'startup', 'enterprise']),
  tagsCount: z.number().min(0),
});
