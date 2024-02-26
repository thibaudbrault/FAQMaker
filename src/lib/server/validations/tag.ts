import { z } from 'zod';

export const createTagServerSchema = z.object({
  label: z.string().trim().min(1, { message: 'Tag name is required' }),
  tenantId: z.string().cuid2(),
});

export const deleteTagServerSchema = z.object({
  body: z.object({
    tenantId: z.string().cuid2(),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});
