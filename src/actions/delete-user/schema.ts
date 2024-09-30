import { z } from 'zod';

export const deleteUserSchema = z.object({
  tenantId: z.string().cuid2(),
  id: z.string().cuid2(),
});
