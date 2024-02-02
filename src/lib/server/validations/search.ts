import { z } from 'zod';

export const getSearchServerSchema = z.object({
  tenantId: z.string().cuid2(),
  searchQuery: z.string().min(1, { message: 'Search query is required' }),
});

export const getTagSearchServerSchema = z.object({
  tenantId: z.string().cuid2(),
  searchTag: z.string().min(1, { message: 'Tag is required' }),
});
