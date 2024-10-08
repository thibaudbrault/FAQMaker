import { z } from 'zod';

export const createUsersSchema = z.object({
  tenantId: z.string().cuid2(),
  usersCount: z.number().min(0),
  usersArray: z.array(z.string().email()),
});
