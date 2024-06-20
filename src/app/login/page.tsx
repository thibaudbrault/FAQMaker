'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button, Field, Input, LoginButton } from '@/components';
import { useMediaQuery } from '@/hooks';
import { userEmailClientSchema } from '@/lib';
import { Routes } from '@/utils';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

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

type Schema = z.infer<typeof userEmailClientSchema>;

const LoginError = ({ error }: ErrorProps) => {
  const errorMessage = error && (loginErrors[error] ?? loginErrors.default);
  return <div className="text-center text-red-9">{errorMessage}</div>;
};

export default async function Page({ searchParams }) {
  const { error, callbackUrl } = searchParams;
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(userEmailClientSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    // await emailSignIn(formData);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <fieldset className="flex w-full flex-col gap-4">
          <div className="col-span-3 row-start-2 flex list-none flex-col gap-2">
            <Field label="Email" value="email" error={errors.email?.message}>
              <Input
                {...register('email')}
                defaultValue=""
                withIcon
                icon={<AtSign className="size-5" />}
                type="email"
                id="email"
                placeholder="Email"
              />
            </Field>
          </div>
        </fieldset>
        <Button
          variant={disabled ? 'disabled' : 'primary'}
          weight="semibold"
          className="lowercase"
          size="full"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Send link
        </Button>
      </form>
      <div className="flex items-center justify-center py-8">
        <hr className="mr-2 w-full" />
        <span className="text-center text-xl font-semibold">OR</span>
        <hr className="ml-2 w-full" />
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
