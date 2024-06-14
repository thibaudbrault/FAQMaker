'use server';

import { signIn } from '@/auth';
import { successToast } from '@/components';
import 'server-only';

type EmailSignInData = {
  email: string;
};

export async function emailSignIn(formData: FormData) {
  const data = Object.fromEntries(formData) as EmailSignInData;
  await signIn('resend', formData);
  successToast(`Link sent to ${data.email}`);
}
