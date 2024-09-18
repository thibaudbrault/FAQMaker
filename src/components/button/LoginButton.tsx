'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';

import googleIcon from '@/assets/google.svg';

import { Button } from './Button';

type Props = {
  callbackUrl: string;
};

export const LoginButton = ({ callbackUrl }: Props) => {
  return (
    <Button
      variant="primary"
      size="full"
      icon={true}
      font="large"
      weight="bold"
      type="submit"
      onClick={() => signIn(`google`, { callbackUrl: callbackUrl ?? '/' })}
    >
      <Image src={googleIcon} alt="" width={28} height={28} />
      Sign In with Google
    </Button>
  );
};
