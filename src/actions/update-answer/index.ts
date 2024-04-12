'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    const session = await getServerSession(authOptions);
    if (session) {
      const result = updateAnswerSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      } else {
        const { text, id, userId } = result.data;
        await prisma.answer.update({
          where: { id },
          data: {
            text,
            userId,
          },
        });
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating answer' };
  }
  revalidatePath('/');
  redirect('/');
  return { message: 'Answer updated successfully' };
}
