'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateNodeSchema } from './schema';

export * from './schema';

export const updateNode = authActionClient
  .metadata({ actionName: 'updateNode' })
  .schema(updateNodeSchema)
  .action(
    async ({
      parsedInput: { tenantId, questionId, text, tags, id },
      ctx: { userId },
    }) => {
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
      revalidatePath(Routes.SITE.HOME);
      redirect(Routes.SITE.HOME);
      return { message: 'Question updated successfully' };
    },
  );
