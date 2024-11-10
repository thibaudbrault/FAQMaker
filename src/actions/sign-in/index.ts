'use server';

import { signIn } from '@/auth';
import { Routes } from '@/utils/routing';

export const signInAction = async () => {
  await signIn('google', { redirectTo: Routes.SITE.HOME });
};
