'use server';

import { Storage } from '@google-cloud/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authActionClient } from '@/lib/safe-actions';
import { Routes, bucketName } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateLogoSchema } from './schema';

export * from './schema';

export const updateLogo = authActionClient
  .metadata({ actionName: 'updateLogo' })
  .schema(updateLogoSchema)
  .action(async ({ parsedInput: { logoUrl, id } }) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      select: {
        logo: true,
      },
    });
    const oldLogo = tenant?.logo;
    if (oldLogo) {
      const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
      });
      const bucket = storage.bucket(bucketName);
      const fileName = oldLogo.replace(
        'https://storage.googleapis.com/faqmaker/',
        '',
      );
      bucket.file(fileName).delete();
    }
    await prisma.tenant.update({
      where: { id },
      data: {
        logo: logoUrl,
      },
    });
    revalidatePath(Routes.SITE.HOME);
    redirect(Routes.SITE.HOME);
    return { message: 'Logo created successfully' };
  });
