import { z } from 'zod';

export const createTagClientSchema = z.object({
  label: z.string().trim().min(1, { message: 'Tag name is required' }),
});
