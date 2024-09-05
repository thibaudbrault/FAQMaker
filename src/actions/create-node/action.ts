'use server';

import { IncomingWebhook } from '@slack/webhook';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

import { ActionError, authActionClient } from '@/lib/safe-actions';
import { Routes, dateOptions, timeOptions } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { createNodeSchema, slackIntegrationSchema } from './schema';

export const slackNotification = async (body) => {
  const result = slackIntegrationSchema.safeParse(body);
  if (result.success === false) {
    const errors = result.error.flatten().fieldErrors;
    return { errors: `Invalid request${errors}` };
  }
  const { url, text } = result.data;
  const webhook = new IncomingWebhook(url);
  const message = await webhook.send({
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
  if (!message.text) {
    return { error: 'Slack notifications not sent' };
  }
  return undefined;
};

export const createNode = authActionClient
  .metadata({ actionName: 'createNode' })
  .schema(createNodeSchema)
  .action(
    async ({
      parsedInput: { text, tenantId, tags, integrations, withAnswer },
      ctx: { userId },
    }) => {
      const duplicateQuestion = await prisma.node.findFirst({
        where: { tenantId, question: { text } },
      });
      if (duplicateQuestion) {
        throw new ActionError('This question already exists');
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
        redirect(`${Routes.SITE.ANSWER}?id=${node.id}`);
      }
      revalidatePath(Routes.SITE.HOME);
      redirect(Routes.SITE.HOME);
    },
  );
