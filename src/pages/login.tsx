import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

import googleIcon from '@/assets/google.svg';
import { Button } from '@/components';
import { AuthLayout } from '@/layouts';

function Login() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <AuthLayout hasBackground>
      <div className="flex w-full flex-col gap-4">
        <div className="mb-4 flex w-full flex-col gap-2 text-center">
          <h2
            className="font-serif text-5xl font-bold lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            Login
          </h2>
          <p className="text-sm text-offset">Use your associated account</p>
        </div>
        <Button
          variant="primaryDark"
          size="full"
          icon="withIcon"
          font="large"
          weight="bold"
          type="submit"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          onClick={() =>
            signIn(`google`, {
              callbackUrl: `http://localhost:3000`,
            })
          }
        >
          <Image src={googleIcon} alt="" width={28} height={28} />
          Sign In with Google
        </Button>
        {error && <LoginError error={error} />}
      </div>
    </AuthLayout>
  );
}

export default Login;

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

const LoginError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div className="text-center text-red-700">{errorMessage}</div>;
};
