import { z } from 'zod';

export const updateLogoSchema = z.object({
  logoUrl: z
    .string()
    .url()
    .regex(/^https:\/\/storage\.googleapis\.com\/faqmaker\/logos/),
  id: z.string().cuid2(),
});

export type UpdateLogo = z.infer<typeof updateLogoSchema>;
