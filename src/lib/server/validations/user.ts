import { z } from 'zod';

const ROLE = ['user', 'admin', 'tenant'] as const;

export const createUserServerSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email' }).optional(),
  name: z.string().trim().optional(),
  role: z.enum(ROLE),
  newUsersArray: z.array(z.string().email()).optional(),
  tenantId: z.string().cuid2(),
});

export const updateUserServerSchema = z.object({
  body: z.object({
    tenantId: z.string().cuid2(),
    email: z
      .string()
      .trim()
      .min(1, { message: 'User email is required' })
      .email({ message: 'Invalid email' }),
    name: z.string().trim().optional(),
    role: z.enum(ROLE),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});

export const deleteUserServerSchema = z.object({
  body: z.object({
    tenantId: z.string().cuid2(),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});
