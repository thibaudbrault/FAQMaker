'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateAnswerSchema } from './schema';

export * from './schema';

export const updateAnswer = authActionClient
  .metadata({ actionName: 'updateAnswer' })
  .schema(updateAnswerSchema)
  .action(async ({ parsedInput: { text, id }, ctx: { userId } }) => {
    await prisma.answer.update({
      where: { id },
      data: {
        text,
        userId,
      },
    });
    revalidatePath(Routes.SITE.HOME);
    redirect(Routes.SITE.HOME);
    return { message: 'Answer updated successfully' };
  });
