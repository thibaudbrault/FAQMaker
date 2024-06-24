import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils';

export const userEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' })
    .optional(),
});

export const filesSchema = z.object({
  logo: z
    .custom<File>((file) => file instanceof File, 'Please upload a file')
    .refine((file) => file?.size <= MAX_FILE_SIZE, 'File must be under 5MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Wrong format',
    ),
});

export const csvUploadSchema = z.object({
  name: z.string().min(1, 'Column name is required'),
});

export const createCheckoutSchema = z.object({
  customerId: z.string(),
  lookup_key: z.string(),
});
