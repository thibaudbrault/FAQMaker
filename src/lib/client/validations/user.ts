import { z } from 'zod';

export const userEmailClientSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'User email is required' })
    .email({ message: 'Invalid email' }),
});

export const userRoleClientSchema = z.object({
  role: z.enum(['user', 'admin', 'tenant']),
});

export const createUserClientSchema =
  userEmailClientSchema.merge(userRoleClientSchema);

export const updateUserClientSchema = createUserClientSchema.merge(
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'User name is required' })
      .optional(),
  }),
);
