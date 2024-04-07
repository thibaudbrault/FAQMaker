import Link from 'next/link';

import { LoginButton } from '@/components';
import { Routes } from '@/utils';

export default async function Page({ searchParams }) {
  const { error, callbackUrl } = searchParams;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-4 flex w-full flex-col gap-2 text-center">
        <h2
          className="font-serif text-5xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Login
        </h2>
        <p className="text-sm text-gray-11">Use your associated account</p>
      </div>
      <LoginButton callbackUrl={callbackUrl} />
      {error && <LoginError error={error} />}
      <p className="text-center text-xs">
        No client account ?{' '}
        <Link
          className="font-semibold hover:underline"
          href={Routes.SITE.REGISTER.INDEX}
        >
          Register
        </Link>
      </p>
    </div>
  );
}

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  AccessDenied: 'User not found.',
  default: 'Unable to sign in.',
};

type ErrorProps = {
  error: string;
};

const LoginError = ({ error }: ErrorProps) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div className="text-center text-red-9">{errorMessage}</div>;
};
