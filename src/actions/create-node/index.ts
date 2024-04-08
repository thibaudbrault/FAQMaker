'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { action } from '@/lib';
import prisma from 'lib/prisma';

import 'server-only';
import { createNodeSchema } from './schema';

type Props = {
  text: string;
  slug: string;
  tenantId: string;
  userId: string;
  tags: string[];
  withAnswer: boolean;
};

export const preload = (body: Props) => {
  void createNode(body);
};

export const createNode = action(createNodeSchema, async (body: Props) => {
  try {
    if (!body) {
      return { error: 'Data not provided' };
    }
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createNodeSchema.safeParse(body);
      if (result.success === false) {
        const errors = result.error.formErrors.fieldErrors;
        return { error: 'Invalid request' + errors };
      } else {
        const { text, slug, tenantId, userId, tags, withAnswer } = result.data;
        const duplicateQuestion = await prisma.node.findFirst({
          where: { tenantId, question: { text: text } },
        });
        if (duplicateQuestion) {
          return { error: 'This question already exists' };
        }
        const node = await prisma.node.create({
          data: {
            tenant: { connect: { id: tenantId } },
            question: {
              create: { text, slug, user: { connect: { id: userId } } },
            },
            tags: {
              connect: tags.map((tag) => ({ id: tag })),
            },
          },
        });
        if (withAnswer) {
          return {
            node,
            message: 'Question created successfully',
          };
        }
        revalidatePath('/');
        return { message: 'Question created successfully' };
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating question' };
  }
});
