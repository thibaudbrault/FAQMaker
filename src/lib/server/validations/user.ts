import { z } from 'zod';

const passwordMin = 6;
const passwordMax = 20;

const ROLE = ['user', 'admin'] as const;

export const userLoginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(passwordMin).max(passwordMax).nonempty(),
});

export type LoginCredentials = z.infer<typeof userLoginSchema>;

export const userGetSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['user', 'admin']),
    tenantId: z.string().uuid(),
  })
  .refine((data) => data.id, 'Id should be specified.');

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(passwordMin).max(passwordMax),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(ROLE),
});

export const userUpdateSchema = z
  .object({
    password: z
      .string()
      .min(passwordMin)
      .max(passwordMax)
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    name: z.string().optional().or(z.literal('')),
    firstName: z.string().optional().or(z.literal('')),
    lastName: z.string().optional().or(z.literal('')),
    role: z.enum(ROLE).optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });
