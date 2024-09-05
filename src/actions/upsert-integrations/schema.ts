import { z } from 'zod';

export const upsertIntegrationsSchema = z.object({
  slack: z.string().trim().url({ message: 'Invalid URL' }),
  tenantId: z.string().cuid2(),
});
