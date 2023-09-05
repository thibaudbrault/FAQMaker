import { z } from 'zod';
import { tenantGetSchema } from './tenant';
import { userGetSchema } from './user';
import { tagGetSchema } from './tag';
import { answerGetSchema } from './answer';
import { questionGetSchema } from './question';

export const nodeGetSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  question: questionGetSchema,
  questionId: z.string().uuid(),
  answer: answerGetSchema.optional(),
  tags: z.array(tagGetSchema),
  user: userGetSchema,
  userId: z.string().uuid(),
  tenant: tenantGetSchema,
  tenantId: z.string().uuid(),
});
