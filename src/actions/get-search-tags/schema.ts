import { z } from 'zod';

export const getTagSearchSchema = z.object({
  tenantId: z.string().cuid2(),
  searchTag: z.string().min(1, { message: 'Tag is required' }),
});
