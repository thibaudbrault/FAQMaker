'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { Routes } from '@/utils';
import prisma from 'lib/prisma';

import 'server-only';
import { updateTenantSchema } from './schema';

type UpdateTenantData = {
  text: string;
  id: string;
  userId: string;
};

export async function updateTenant(formData: FormData) {
  try {
    if (!formData) {
      return { error: 'Data not provided' };
    }
    const data = Object.fromEntries(formData) as UpdateTenantData;
    const session = await getServerSession(authOptions);
    if (session) {
      const result = updateTenantSchema.safeParse(data);
      if (result.success === false) {
        const errors = result.error.flatten().fieldErrors;
        return { error: errors };
      }
      const { company, id, email, domain } = result.data;
      await prisma.tenant.update({
        where: { id },
        data: {
          company,
          email,
          domain: domain || '',
        },
      });
    } else {
      return { error: 'Not signed in' };
    }
  } catch (error) {
    return { error: 'Error updating tenant' };
  }
  revalidatePath(Routes.SITE.SETTINGS);
  redirect(Routes.SITE.HOME);
  return { message: 'Tenant updated successfully' };
}
