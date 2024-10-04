'use server';

import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { s3Client } from '@/lib';
import { authActionClient } from '@/lib/safe-actions';
import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import { updateLogoSchema } from './schema';

export const updateLogo = authActionClient
  .metadata({ actionName: 'updateLogo' })
  .schema(updateLogoSchema)
  .action(async ({ parsedInput: { url, id } }) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      select: {
        logo: true,
        company: true,
      },
    });
    const oldLogo = tenant?.logo;
    if (oldLogo) {
      const fileName = oldLogo.substring(oldLogo.lastIndexOf('/') + 1);
      const params: DeleteObjectCommandInput = {
        Bucket: process.env.AWS_S3_BUCKET as string,
        Key: `${tenant.company}/${fileName}`,
      };
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
    }
    await prisma.tenant.update({
      where: { id },
      data: {
        logo: url,
      },
    });
    revalidatePath(Routes.SITE.HOME);
    redirect(Routes.SITE.HOME);
  });
