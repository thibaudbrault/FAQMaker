import { z } from 'zod';

const path = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL;

export const updateLogoSchema = z.object({
  url: z
    .string()
    .url()
    .regex(new RegExp(`^${path}`)),
  id: z.string().cuid2(),
});
