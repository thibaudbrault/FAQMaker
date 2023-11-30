import { z } from 'zod';

export const integrationsClientSchema = z.object({
  slack: z.string().trim().url({ message: 'Invalid URL' }),
});
