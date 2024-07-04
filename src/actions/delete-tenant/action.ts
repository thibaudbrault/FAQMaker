'use server';

import { Storage } from '@google-cloud/storage';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

import { Routes, STRIPE_VERSION } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_VERSION,
});

// export const deleteTenant = authActionClient
//   .metadata({ actionName: 'deleteTenant' })
//   .schema(deleteTenantSchema(data.company))
//   .action(async ({ parsedInput: { id, company } }) => {
//     const tenant = await prisma.tenant.findUnique({
//       where: { id, company },
//       select: {
//         customerId: true,
//         logo: true,
//       },
//     });
//     const { customerId, logo } = tenant;
//     if (logo) {
//       const storage = new Storage({
//         projectId: process.env.PROJECT_ID,
//         credentials: {
//           client_email: process.env.CLIENT_EMAIL,
//           private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
//         },
//       });
//       const bucketName = 'faqmaker';
//       const bucket = storage.bucket(bucketName);
//       const fileName = logo.replace(
//         'https://storage.googleapis.com/faqmaker/',
//         '',
//       );
//       bucket.file(fileName).delete();
//     }
//     await prisma.tenant.delete({
//       where: { id, company },
//     });
//     if (customerId) {
//       await stripe.customers.del(customerId);
//     }
//     redirect(Routes.SITE.LOGIN);
//     return { message: 'Account deleted successfully' };
//   });

export const deleteTenant = async (data) => {
  const { id, company } = data;
  const tenant = await prisma.tenant.findUnique({
    where: { id, company },
    select: {
      customerId: true,
      logo: true,
    },
  });
  const { customerId, logo } = tenant;
  if (logo) {
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
    const bucketName = 'faqmaker';
    const bucket = storage.bucket(bucketName);
    const fileName = logo.replace(
      'https://storage.googleapis.com/faqmaker/',
      '',
    );
    bucket.file(fileName).delete();
  }
  await prisma.tenant.delete({
    where: { id, company },
  });
  if (customerId) {
    await stripe.customers.del(customerId);
  }
  redirect(Routes.SITE.LOGIN);
  return { message: 'Account deleted successfully' };
};
