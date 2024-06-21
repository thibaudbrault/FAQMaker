import { z } from 'zod';

export const slackIntegrationSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' }),
  url: z.string().trim().url({ message: 'Invalid URL' }),
});

export const createNodeSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' })
    .max(100, { message: 'Question must be under 100 characters long' }),
  tenantId: z.string().cuid2(),
  tags: z.array(z.string().cuid2()).optional(),
  withAnswer: z.boolean().optional(),
  integrations: z
    .object({
      slack: z.string().trim().url({ message: 'Invalid URL' }).optional(),
    })
    .nullable(),
});
