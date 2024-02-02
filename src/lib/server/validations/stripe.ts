import { z } from "zod";

export const createCheckoutServerSchema = z.object({
    customerId: z.string().cuid2(),
    lookup_key: z.string()
})

export const createCustomerServerSchema = z.object({
    company: z.string().trim().min(1, { message: 'Company name is required' }),
  companyEmail: z
    .string()
    .trim()
    .min(1, { message: 'Company email is required' })
    .email({ message: 'Invalid email' }),
})