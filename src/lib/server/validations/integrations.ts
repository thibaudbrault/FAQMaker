import { z } from 'zod';

export const createIntegrationServerSchema = z.object({
  slack: z.string().trim().url({ message: 'Invalid URL' }),
  tenantId: z.string().cuid2(),
});

export const slackIntegrationServerSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' }),
  url: z.string().trim().url({ message: 'Invalid URL' }),
});
