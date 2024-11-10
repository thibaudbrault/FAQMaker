import { z } from 'zod';

export const deleteTagSchema = z.object({
  tenantId: z.string().cuid2(),
  id: z.string().cuid2(),
});
