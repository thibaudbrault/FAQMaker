import { z } from 'zod';

export const updateLogoSchema = z.object({
  url: z
    .string()
    .url()
    .regex(/^https:\/\/storage\.googleapis\.com\/faqmaker\/logos/),
  id: z.string().cuid2(),
});
