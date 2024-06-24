import { z } from 'zod';

export const createTenantCompanySchema = z.object({
  company: z.string().min(1, { message: 'Company name is required' }),
  companyEmail: z
    .string()
    .trim()
    .min(1, { message: 'Company email is required' })
    .email({ message: 'Invalid email' }),
  domain: z.string().trim().nullable(),
});

export const createTenantUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' }),
});

export const createTenantSchema = createTenantCompanySchema.merge(
  createTenantUserSchema,
);
