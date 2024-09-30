'use server';

import { signIn } from '@/auth';
import { Routes } from '@/utils';

export const signInAction = async () => {
  await signIn('google', { redirectTo: Routes.SITE.HOME });
};
