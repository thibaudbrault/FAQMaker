'use server';

import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

import { s3Client } from '@/lib';
import { authActionClient } from '@/lib/safe-actions';
import { Routes, STRIPE_VERSION } from '@/utils';
import prisma from 'lib/prisma';

import { deleteTenantSchema } from './schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_VERSION,
});

export const deleteTenant = authActionClient
  .metadata({ actionName: 'deleteTenant' })
  .schema(deleteTenantSchema)
  .action(async ({ parsedInput: { id, company } }) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id, company },
      select: {
        customerId: true,
        logo: true,
      },
    });
    const logo = tenant?.logo;
    if (logo) {
      const fileName = logo.substring(logo.lastIndexOf('/') + 1);
      const params: DeleteObjectCommandInput = {
        Bucket: process.env.AWS_S3_BUCKET as string,
        Key: `${company}/${fileName}`,
      };
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
    }
    await prisma.tenant.delete({
      where: { id, company },
    });
    const customerId = tenant?.customerId;
    if (customerId) {
      await stripe.customers.del(customerId);
    }
    redirect(Routes.SITE.LOGIN);
    return { message: 'Account deleted successfully' };
  });
