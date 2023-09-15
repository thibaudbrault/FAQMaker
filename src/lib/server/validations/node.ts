import { z } from 'zod';

import { answerGetSchema } from './answer';
import { questionGetSchema } from './question';
import { tagGetSchema } from './tag';
import { tenantGetSchema } from './tenant';
import { userGetSchema } from './user';

export const nodeGetSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  question: questionGetSchema,
  questionId: z.string().cuid(),
  answer: answerGetSchema.optional(),
  tags: z.array(tagGetSchema),
  user: userGetSchema,
  userId: z.string().cuid(),
  tenant: tenantGetSchema,
  tenantId: z.string().cuid(),
});
