import { z } from 'zod';

export const userEmailClientSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' })
    .optional(),
});

export const userRoleClientSchema = z.object({
  role: z.enum(['user', 'admin', 'tenant']).optional(),
});

export const createUserClientSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' })
    .optional(),
  role: z.enum(['user', 'admin', 'tenant']).optional(),
  usersCount: z.number().min(0),
});

export const updateUserClientSchema = createUserClientSchema.merge(
  z.object({
    name: z.string().trim().optional(),
  }),
);
