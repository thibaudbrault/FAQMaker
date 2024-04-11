'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from 'lib/prisma';


import 'server-only';
import { createAnswerSchema } from './schema';

type CreateAnswerData = {
  text: string;
  nodeId: string;
  userId: string;
};

export async function createAnswer(formData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateAnswerData;
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createAnswerSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        console.log(errors);
        return { error: errors };
      } else {
        const { text, nodeId, userId } = result.data;
        await prisma.answer.create({
          data: {
            nodeId,
            userId,
            text,
          },
        });
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating answer' };
  }
  revalidatePath('/');
  redirect('/');
  return { message: 'Answer created successfully' };
}
