'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateAnswerSchema } from './schema';

type UpdateAnswerData = {
  text: string;
  id: string;
  userId: string;
};

export async function updateAnswer(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as UpdateAnswerData;
    const session = await auth();
    if (session) {
      const result = updateAnswerSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { text, id, userId } = result.data;
      await prisma.answer.update({
        where: { id },
        data: {
          text,
          userId,
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating answer' };
  }
  revalidatePath(Routes.SITE.HOME);
  redirect(Routes.SITE.HOME);
  return { message: 'Answer updated successfully' };
}
