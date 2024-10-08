import { z } from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils';

export const answerSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Answer is required' })
    .max(1000, { message: 'Answer must be under 1000 characters long' }),
});

export const favoriteSchema = z.object({
  nodeId: z.string().cuid2(),
});

export const pinSchema = z.object({
  nodeId: z.string().cuid2(),
  tenantId: z.string().cuid2(),
});

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
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max file size is 5MB',
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png, .webp and .svg files are accepted.',
    ),
});

export const csvUploadSchema = z.object({
  name: z.string().min(1, 'Column name is required'),
});

export const createCheckoutSchema = z.object({
  customerId: z.string(),
  lookup_key: z.string(),
});
