import { z } from 'zod';

import { PLAN } from '@/utils';

export const createTagSchema = z.object({
  label: z.string().trim().min(1, { message: 'Tag name is required' }),
  tenantId: z.string().cuid2(),
  plan: z.enum(PLAN),
  tagsCount: z.number().min(0),
});
