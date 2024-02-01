import { z } from 'zod';


export const getTenantIdSchema = z.object({
  tenantId: z.string().cuid2(),
});

export const getIdSchema = z.object({
  id: z.string().cuid2(),
});

export const getUserIdSchema = z.object({
  userId: z.string().cuid2()
})