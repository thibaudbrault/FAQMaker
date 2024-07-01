'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
// import prisma from 'lib/prisma';

import 'server-only';
import { upsertReactionSchema } from './schema';

export const upsertReaction = authActionClient
  .metadata({ actionName: 'upsertReaction' })
  .schema(upsertReactionSchema)
  .action(
    async ({
      parsedInput: { nodeId, shortcode: _shortcode },
      ctx: { userId: _userId },
    }) => {
      // TODO: Rethink the logic
      // const reactionExists = await prisma.reaction.findFirst({
      //   where: {shortcode, nodeId}
      // })
      // if (reactionExists) {
      //   await prisma
      // }
      // await prisma.reaction.upsert({
      //   where: {shortcode, nodeId},
      //   update: {
      //     count: {
      //       increment: 1
      //     }
      //   }
      //   create: {
      //     shortcode,
      //     nodeId,
      //     userId,
      //   },
      // });
      revalidatePath(`${Routes.SITE.QUESTION}/${nodeId}`);
    },
  );
