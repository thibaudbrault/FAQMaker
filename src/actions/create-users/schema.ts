import { z } from 'zod';

export const createUsersSchema = z.object({
  tenantId: z.string().cuid2(),
  usersCount: z.number().min(0),
  newUsersArray: z.array(z.string().email()).optional(),
});
