'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateNodeSchema } from './schema';

type UpdateNodeData = {
  text: string;
  id: string;
  userId: string;
  tenantId: string;
  questionId: string;
  tags: string;
};

export async function updateNode(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as UpdateNodeData;
    if (data.tags) {
      data.tags = JSON.parse(data.tags);
    }
    const session = await getServerSession(authOptions);
    if (session) {
      const result = updateNodeSchema.safeParse({ ...data });
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { tenantId, questionId, text, userId, tags, id } = result.data;
      const duplicateQuestion = await prisma.node.findFirst({
        where: {
          tenantId,
          question: { text },
          tags: { every: { id: { in: tags }, tenantId }, some: {} },
        },
      });
      if (duplicateQuestion) {
        return { error: 'This question already exists' };
      }
      await prisma.node.update({
        where: { id, tenantId: tenantId as string },
        data: {
          question: {
            update: {
              where: { id: questionId as string },
              data: {
                text: text as string,
                slug: slugify(text).toLowerCase(),
                user: { connect: { id: userId } },
              },
            },
          },
          tags: {
            set: tags.map((tag: string) => {
              return {
                id: tag,
                tenantId,
              };
            }),
          },
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating question' };
  }
  revalidatePath(Routes.SITE.HOME);
  redirect(Routes.SITE.HOME);
  return { message: 'Question updated successfully' };
}
