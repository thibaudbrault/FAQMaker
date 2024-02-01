import { z } from 'zod';

export const getIdSchemaFn = (key: string) =>
  z.object({
    [key]: z.string(),
  });

export const getTenantIdSchema = z.object({
  tenantId: z.string().cuid2(),
});

export const getIdSchema = z.object({
  id: z.string().cuid2(),
});
