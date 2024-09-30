import { z } from 'zod';

export const createTenantServerSchema = z.object({
  company: z.string().trim().min(1, { message: 'Company name is required' }),
  companyEmail: z
    .string()
    .trim()
    .min(1, { message: 'Company email is required' })
    .email({ message: 'Invalid email' }),
  domain: z.string().trim().nullable(),
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' }),
});

export const updateTenantServerSchema = z.object({
  body: z.object({
    company: z.string().trim().min(1, { message: 'Company name is required' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email' }),
    domain: z.string().trim().nullable(),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});

export const deleteTenantServerSchema = (company: string) =>
  z.object({
    body: z.object({
      text: z.literal(`DELETE ${company}`),
      company: z.string(),
    }),
    query: z.object({
      id: z.string().cuid2(),
    }),
  });

export const updateLogoServerSchema = z.object({
  body: z.object({
    filename: z.string(),
    logoUrl: z
      .string()
      .url()
      .regex(/^https:\/\/storage\.googleapis\.com\/faqmaker\/logos/),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});
