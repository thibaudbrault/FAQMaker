'use server';

import { signIn } from 'next-auth/react';

import { successToast } from '@/components';
import 'server-only';

type EmailSignInData = {
  email: string;
};

export async function emailSignIn(formData: FormData) {
  const data = Object.fromEntries(formData) as EmailSignInData;
  await signIn('email', data);
  successToast(`Link sent to ${data.email}`);
}
