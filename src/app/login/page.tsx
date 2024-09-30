import Image from 'next/image';
import Link from 'next/link';

import { signInAction } from '@/actions';
import googleIcon from '@/assets/google.svg';
import { Button } from '@/components';
import { Routes } from '@/utils';

import EmailForm from './EmailForm';

const loginErrors = {
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
  const errorMessage = error && (loginErrors[error] ?? loginErrors.default);
  return <div className="text-center text-destructive">{errorMessage}</div>;
};

export default function Page({ searchParams }) {
  const { error } = searchParams;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-4 flex w-full flex-col gap-2 text-center">
        <h2
          className="font-serif text-5xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Login
        </h2>
        <p className="text-sm text-primary-muted">
          Use your associated account
        </p>
      </div>
      <EmailForm />
      <div className="flex items-center justify-center py-8">
        <hr className="mr-2 w-full" />
        <span className="text-center text-xl font-semibold">OR</span>
        <hr className="ml-2 w-full" />
      </div>
      <form action={signInAction}>
        <Button
          variant="primary"
          size="full"
          icon={true}
          font="large"
          weight="bold"
          type="submit"
        >
          <Image src={googleIcon} alt="" width={28} height={28} />
          Sign In with Google
        </Button>
      </form>
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
