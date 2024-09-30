import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { getUserId } from '@/actions/get-me';
import { auth } from '@/auth';

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: 'flattened',
  handleServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }
    return 'Something went wrong';
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth();
  if (!session) {
    throw new Error('Not signed in');
  }
  const userId = await getUserId(session);
  if (!userId) {
    throw new Error('User does not exist');
  }
  return next({
    ctx: {
      userId,
    },
  });
});
