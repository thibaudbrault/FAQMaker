'use server';

import { signOut } from '@/auth';
import { Routes } from '@/utils/routing';

export const signOutAction = async () => {
  await signOut({ redirectTo: Routes.SITE.HOME });
};
