import { z } from 'zod';

export const csvUploadClientSchema = z.object({
  name: z.string().min(1, 'Column name is required'),
});
