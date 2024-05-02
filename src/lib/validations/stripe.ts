import { z } from 'zod';

export const createCheckoutSchema = z.object({
  customerId: z.string(),
  lookup_key: z.string(),
});

export const createCustomerSchema = z.object({
  company: z.string().trim().min(1, { message: 'Company name is required' }),
  companyEmail: z
    .string()
    .trim()
    .min(1, { message: 'Company email is required' })
    .email({ message: 'Invalid email' }),
});
