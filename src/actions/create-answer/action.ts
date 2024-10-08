'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { createAnswerSchema } from './schema';

export const createAnswer = authActionClient
  .metadata({ actionName: 'createAnswer' })
  .schema(createAnswerSchema)
  .action(async ({ parsedInput: { text, nodeId }, ctx: { userId } }) => {
    await prisma.answer.create({
      data: {
        nodeId,
        userId,
        text,
      },
    });
    revalidatePath(Routes.SITE.HOME);
    redirect(Routes.SITE.HOME);
  });
