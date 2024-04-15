'use server';

import { Storage } from '@google-cloud/storage';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import 'server-only';
import { upsertLogoSchema } from './schema';

const bucketName = 'faqmaker';

type SignedLogoData = {
  logo: string;
};

export async function getSignedLogo(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as SignedLogoData;
    const session = await getServerSession(authOptions);
    if (session) {
      const result = upsertLogoSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      } else {
        const { logo } = result.data;
        const storage = new Storage({
          projectId: process.env.PROJECT_ID,
          credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
        });
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`logos/${logo}`);
        const options = {
          expires: Date.now() + 1 * 60 * 1000, //  1 minute,
          fields: { 'x-goog-meta-test': 'data' },
        };
        const [response] = await file.generateSignedPostPolicyV4(options);
        return {
          url: response.url,
          fields: response.fields,
        };
      }
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating logo' };
  }
}
