'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { upsertReactionSchema } from './schema';

export const upsertReaction = authActionClient
  .metadata({ actionName: 'upsertReaction' })
  .schema(upsertReactionSchema)
  .action(
    async ({ parsedInput: { nodeId, shortcode, emoji }, ctx: { userId } }) => {
      const reactionExists = await prisma.reaction.findFirst({
        where: { shortcode, nodeId },
      });
      if (reactionExists) {
        const userReactionExists = await prisma.reactionUser.findFirst({
          where: { reactionId: reactionExists.id, userId },
        });
        if (userReactionExists) {
          await prisma.reactionUser.delete({
            where: { id: userReactionExists.id },
          });
          const updatedReaction = await prisma.reaction.update({
            where: { shortcode, nodeId, id: reactionExists.id },
            data: {
              count: {
                decrement: 1,
              },
            },
          });
          if (updatedReaction.count === 0) {
            await prisma.reaction.delete({
              where: { shortcode, nodeId, id: reactionExists.id },
            });
          }
        } else {
          await prisma.reaction.update({
            where: { id: reactionExists.id },
            data: {
              count: {
                increment: 1,
              },
              users: {
                create: {
                  user: {
                    connect: { id: userId },
                  },
                },
              },
            },
          });
        }
      } else {
        await prisma.reaction.create({
          data: {
            shortcode,
            nodeId,
            emoji,
            users: {
              create: {
                user: {
                  connect: { id: userId },
                },
              },
            },
          },
        });
      }
      revalidatePath(`${Routes.SITE.QUESTION}/${nodeId}`);
    },
  );
