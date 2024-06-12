'use client';

import Link from 'next/link';

import { Button, Field, Input, LoginButton, Password } from '@/components';
import { Routes } from '@/utils';
import { useMediaQuery } from '@/hooks';
import { userLoginClientSchema } from '@/lib';
import { IUserLoginFields, IUserUpdateFields } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserIcon, AtSign, Lock } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

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

type Schema = z.infer<typeof userLoginClientSchema>;

const LoginError = ({ error }: ErrorProps) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <div className="text-center text-red-9">{errorMessage}</div>;
};

export default async function Page({ searchParams }) {
  const { error, callbackUrl } = searchParams;
  const [disabled, setDisabled] = useState<boolean>(true);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(userLoginClientSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    // await updateUser(formData);
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
          <ul className="col-span-3 row-start-2 flex list-none flex-col gap-2">
            <li key={'email'} className="flex flex-col gap-1">
              <Field
                label={'Email'}
                value={'email'}
                error={errors.email?.message}
              >
                <Input
                  {...register('email')}
                  defaultValue={''}
                  withIcon
                  icon={<AtSign className="size-5" />}
                  type={'email'}
                  id={'email'}
                  placeholder={'Email'}
                />
              </Field>
            </li>
            <li key={'password'} className="flex flex-col gap-1">
              <Field
                label={'Password'}
                value={'password'}
                error={errors.password?.message}
              >
                <Password
                  {...register('password')}
                  defaultValue={''}
                  lockIcon={<Lock className="size-5" />}
                  type={'password'}
                  id={'password'}
                  placeholder={'Password'}
                />
              </Field>
            </li>
          </ul>
        </fieldset>
        <Button
          variant={disabled ? 'disabled' : 'primary'}
          weight="semibold"
          className="lowercase"
          size="full"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Update
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
