import { z } from 'zod';

export const upsertLogoSchema = z.object({
  logo: z.string().min(1, { message: 'Logo is required' }),
});
