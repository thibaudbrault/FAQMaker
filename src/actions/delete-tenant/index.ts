'use server';

import { Storage } from '@google-cloud/storage';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Stripe from 'stripe';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { deleteTenantSchema } from './schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

type DeleteTenantData = {
  text: string;
  company: string;
  id: string;
};

export async function deleteTenant(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as DeleteTenantData;
    const session = await auth();
    if (session) {
      const result = deleteTenantSchema(data.company).safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { id, company } = result.data;
      const { customerId, logo } = await prisma.tenant.findUnique({
        where: { id, company },
        select: {
          customerId: true,
          logo: true,
        },
      });
      const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
      });
      const bucketName = 'faqmaker';
      const bucket = storage.bucket(bucketName);
      if (logo) {
        const fileName = logo.replace(
          'https://storage.googleapis.com/faqmaker/',
          '',
        );
        bucket.file(fileName).delete();
      }
      if (!customerId) return { error: `Customer not found` };
      await prisma.tenant.delete({
        where: { id, company },
      });
      await stripe.customers.del(customerId);
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error deleting tenant' };
  }
  redirect(Routes.SITE.LOGIN);
  return { message: 'Tenant deleted successfully' };
}
