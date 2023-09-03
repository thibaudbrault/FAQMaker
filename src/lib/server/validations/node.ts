import { z } from 'zod';
import { tenantGetSchema } from './tenant';
import { userGetSchema } from './user';
import { tagGetSchema } from './tag';
import { answerGetSchema } from './answer';
import { questionGetSchema } from './question';

export const nodeGetSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  question: questionGetSchema,
  questionId: z.string().cuid(),
  answer: answerGetSchema.optional(),
  tags: z.array(tagGetSchema),
  user: userGetSchema,
  userId: z.string().cuid(),
  tenant: tenantGetSchema,
  tenantId: z.string().cuid(),
});
