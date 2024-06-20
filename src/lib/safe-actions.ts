import { getServerSession } from 'next-auth';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { getUserId } from '@/actions/get-me';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: 'flattened',
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession(authOptions);
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
