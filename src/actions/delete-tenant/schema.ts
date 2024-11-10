import { z } from 'zod';

export const deleteTenantSchema = z
  .object({
    text: z.string().trim().min(1),
    company: z.string(),
    id: z.string().cuid2(),
  })
  .refine((data) => data.text === `DELETE ${data.company}`, {
    message: 'Confirmation text does not match expected format',
    path: ['text'],
  });
