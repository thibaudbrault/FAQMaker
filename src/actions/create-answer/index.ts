'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createAnswerSchema } from './schema';

type CreateAnswerData = {
  text: string;
  nodeId: string;
  userId: string;
};

export async function createAnswer(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateAnswerData;
    const session = await auth();
    if (session) {
      const result = createAnswerSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { text, nodeId, userId } = result.data;
      await prisma.answer.create({
        data: {
          nodeId,
          userId,
          text,
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating answer' };
  }
  revalidatePath(Routes.SITE.HOME);
  redirect(Routes.SITE.HOME);
  return { message: 'Answer created successfully' };
}
