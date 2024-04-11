'use server';

import { IncomingWebhook } from '@slack/webhook';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dateOptions, timeOptions } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createNodeSchema, slackIntegrationSchema } from './schema';

type CreateNodeData = {
  text: string;
  tenantId: string;
  userId: string;
  withAnswer?: boolean;
};

export const createNode = async (integrations, tags, formData) => {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as CreateNodeData;
    const session = await getServerSession(authOptions);
    if (session) {
      const result = createNodeSchema.safeParse({ ...data, tags });
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      } else {
        const { text, tenantId, userId, tags, withAnswer } = result.data;
        const duplicateQuestion = await prisma.node.findFirst({
          where: { tenantId, question: { text: text } },
        });
        if (duplicateQuestion) {
          return { error: 'This question already exists' };
        }
        if (integrations && integrations.slack) {
          const slackBody = {
            text,
            url: integrations.slack,
          };
          await slackNotification(slackBody);
        }
        const node = await prisma.node.create({
          data: {
            tenant: { connect: { id: tenantId } },
            question: {
              create: {
                text,
                slug: slugify(text).toLowerCase(),
                user: { connect: { id: userId } },
              },
            },
            tags: {
              connect: tags?.map((tag) => ({ id: tag })),
            },
          },
        });
        if (withAnswer) {
          return {
            node,
            message: 'Question created successfully',
          };
        }
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error creating question' };
  }
  revalidatePath('/');
  redirect('/');
  return { message: 'Question created successfully' };
};

export const slackNotification = async (body) => {
  const result = slackIntegrationSchema.safeParse(body);
  if (result.success === false) {
    const errors = result.error.flatten().fieldErrors;
    return { errors: 'Invalid request' + errors };
  } else {
    const { url, text } = result.data;
    const webhook = new IncomingWebhook(url);
    await webhook.send({
      text,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${text}*`,
          },
        },
        {
          type: 'divider',
          block_id: 'divider1',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Asked on ${new Date().toLocaleDateString(
              undefined,
              dateOptions,
            )} at ${new Date().toLocaleTimeString(undefined, timeOptions)}`,
          },
        },
      ],
    });
    return;
  }
};
