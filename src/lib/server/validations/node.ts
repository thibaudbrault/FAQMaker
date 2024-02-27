import { z } from 'zod';

export const getNodeServerSchema = z.object({
  tenantId: z.string().cuid2(),
  id: z.string().cuid2(),
});

export const getNodesServerSchema = z.object({
  tenantId: z.string(),
  page: z.string(),
});

export const createNodeServerSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, { message: 'Question must be at least 3 characters long' })
    .max(100, { message: 'Question must be under 100 characters long' }),
  slug: z.string(),
  tenantId: z.string().cuid2(),
  userId: z.string().cuid2(),
  tags: z.array(z.string().cuid2()),
  withAnswer: z.boolean().optional(),
});

export const updateNodeServerSchema = z.object({
  body: z.object({
    text: z
      .string()
      .trim()
      .min(3, { message: 'Question must be at least 3 characters long' })
      .max(100, { message: 'Question must be under 100 characters long' }),
    userId: z.string().cuid2(),
    questionId: z.string().cuid2(),
    tenantId: z.string().cuid2(),
    slug: z.string(),
    tags: z.array(z.string().cuid2()),
  }),
  query: z.object({
    id: z.string().cuid2(),
  }),
});
