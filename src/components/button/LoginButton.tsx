'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';

import googleIcon from '@/assets/google.svg';
import { Button } from '@/components';

type Props = {
  callbackUrl: string;
};

export const LoginButton = ({ callbackUrl }: Props) => {
  return (
    <Button
      variant="primary"
      size="full"
      icon="withIcon"
      font="large"
      weight="bold"
      type="submit"
      className="lowercase"
      style={{ fontVariant: 'small-caps' }}
      onClick={() => signIn(`google`, { callbackUrl: '/' })}
    >
      <Image src={googleIcon} alt="" width={28} height={28} />
      Sign In with Google
    </Button>
  );
};
