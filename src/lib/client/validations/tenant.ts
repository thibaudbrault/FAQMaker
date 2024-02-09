import { z } from 'zod';

import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/utils';

export const updateTenantClientSchema = z.object({
  company: z.string().trim().min(1, { message: 'Company name is required' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Company email is required' })
    .email({ message: 'Invalid email' }),
  domain: z.string().trim().nullable(),
  logo: z
    .custom<File>((file) => file instanceof File, 'Please upload a file')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'File must be under 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Wrong format',
    ),
});
