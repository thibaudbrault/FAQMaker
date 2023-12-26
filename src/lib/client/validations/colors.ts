import { z } from 'zod';

export const colorsClientSchema = z.object({
  foreground: z.string().trim().url({ message: 'Invalid URL' }),
  background: z.string().trim().url({ message: 'Invalid URL' }),
});
