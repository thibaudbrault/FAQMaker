import { z } from 'zod';

export const deleteTenantSchema = (company: string) =>
  z.object({
    text: z.literal(`DELETE ${company}`),
    company: z.string(),
    id: z.string().cuid2(),
  });
