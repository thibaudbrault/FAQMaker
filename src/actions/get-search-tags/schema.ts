import { z } from 'zod';

export const getTagSearchSchema = z.object({
  tenantId: z.string().cuid2(),
  tag: z.string().min(1, { message: 'Tag is required' }),
});
