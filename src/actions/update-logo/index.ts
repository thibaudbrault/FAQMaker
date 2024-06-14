'use server';

import { Storage } from '@google-cloud/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

import { Routes, bucketName } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateLogoSchema } from './schema';

type UpdateLogoData = {
  logoUrl: string;
  id: string;
};

export async function updateLogo(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as UpdateLogoData;
    const session = await auth();
    if (session) {
      const result = updateLogoSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { logoUrl, id } = result.data;
      const { logo: oldLogo } = await prisma.tenant.findUnique({
        where: { id },
        select: {
          logo: true,
        },
      });
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
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating answer' };
  }
  revalidatePath(Routes.SITE.HOME);
  redirect(Routes.SITE.HOME);
  return { message: 'Answer updated successfully' };
}
