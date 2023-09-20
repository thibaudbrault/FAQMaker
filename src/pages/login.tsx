import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Button, Input, Label, errorToast, successToast } from '@/components';
import { LoginCredentials, userLoginSchema } from '@/lib';
import { AuthLayout } from '@/layouts';

function Login() {
  const router = useRouter();
  const { error } = router.query;
  const [isShown, setIsShown] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<LoginCredentials>({
    resolver: zodResolver(userLoginSchema),
  });

  const { mutate: loginHandler, isLoading } = useMutation({
    mutationFn: async (values: LoginCredentials) => {
      try {
        await signIn(`credentials`, {
          ...values,
          callbackUrl: `${window.location.origin}/`,
        });
        await router.push(`/`);
        successToast(`You are logged in`);
      } catch (error) {
        if (error instanceof AxiosError) {
          errorToast(error.response?.data.message);
        }
      }
    },
  });

  return (
    <AuthLayout>
      <div className="flex w-full flex-col items-center rounded-md bg-green-50 px-8 py-20">
        <h2
          className="mb-8 font-serif text-5xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Login
        </h2>
        <form
          onSubmit={handleSubmit((values) => loginHandler(values))}
          className="flex w-full flex-col gap-8"
        >
          <fieldset className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" style={{ fontVariant: 'small-caps' }}>
                email
              </Label>
              <Input
                {...register('email', { required: true })}
                type="email"
                placeholder="Email"
                maxLength={48}
                className="w-full border border-transparent border-b-teal-700 bg-transparent p-1 outline-none placeholder:text-stone-500 focus:rounded-md focus:border-teal-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" style={{ fontVariant: 'small-caps' }}>
                password
              </Label>
              <div className=" flex items-center justify-between border border-transparent border-b-teal-700 bg-transparent p-1">
                <Input
                  {...register('password', { required: true })}
                  type={isShown ? 'text' : 'password'}
                  placeholder="Password"
                  maxLength={48}
                  className="w-full bg-transparent pr-6 outline-none placeholder:text-stone-500 focus:rounded-md focus:border-teal-700"
                />
                <button type="button" onClick={() => setIsShown(!isShown)}>
                  {isShown ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          </fieldset>
          <Button
            variant={isLoading ? 'disabledDark' : 'primaryDark'}
            size="full"
            font="large"
            weight="bold"
            type="submit"
            style={{ fontVariant: 'small-caps' }}
          >
            {isLoading ? 'loading...' : 'submit'}
          </Button>
        </form>
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
  default: 'Unable to sign in.',
};

const LoginError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div className="mt-6 text-red-700">{errorMessage}</div>;
};
