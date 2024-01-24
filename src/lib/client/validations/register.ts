import { z } from 'zod';

export const registerCompanyClientSchema = z.object({
  company: z.string().min(1, { message: 'Company name is required' }),
  companyEmail: z
    .string()
    .trim()
    .min(1, { message: 'Company email is required' })
    .email({ message: 'Invalid email' }),
  domain: z.string().trim().nullable(),
});

export const registerUserClientSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' }),
});

export const registerCompleteClientSchema = registerCompanyClientSchema.merge(
  registerUserClientSchema,
);
