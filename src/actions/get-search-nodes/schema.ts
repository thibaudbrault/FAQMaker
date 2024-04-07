import { z } from 'zod';

export const getSearchSchema = z.object({
  tenantId: z.string().cuid2(),
  searchQuery: z.string().min(1, { message: 'Search query is required' }),
});
