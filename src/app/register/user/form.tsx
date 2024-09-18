'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { MoveLeft, MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createTenantUserSchema } from '@/actions';
import { Button, Field, Input } from '@/components';
import { registerAtom } from '@/store';
import { Routes } from '@/utils';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Schema = z.infer<typeof createTenantUserSchema>;

export default function Form() {
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(createTenantUserSchema),
    mode: 'onBlur',
    defaultValues: state,
  });

  const saveData: SubmitHandler<Schema> = (values) => {
    setState({ ...state, ...values });
    router.push(Routes.SITE.REGISTER.CONFIRM);
  };

  return (
    <form
      onSubmit={handleSubmit(saveData)}
      className="flex w-full flex-col gap-4"
    >
      <fieldset className="flex w-full flex-col gap-4">
        <div className="mb-4 flex w-full flex-col gap-2 text-center">
          <legend
            className="font-serif text-5xl font-bold lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            User
          </legend>
          <p className="text-sm text-primary-muted">Your connection mail</p>
        </div>
        <Field label="Email" value="email" error={errors.email?.message}>
          <Input
            {...register('email')}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-transparent"
          />
        </Field>
      </fieldset>
      <div className="flex w-full items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="full"
          icon={true}
          font="large"
          weight="bold"
          type="button"
          onClick={() => router.push(Routes.SITE.REGISTER.INDEX)}
        >
          <MoveLeft />
          Previous
        </Button>
        <Button
          variant="primary"
          size="full"
          icon={true}
          font="large"
          weight="bold"
          disabled={!isValid}
          type="submit"
        >
          Next
          <MoveRight />
        </Button>
      </div>
      <p className="text-center text-xs">
        Already have an account ?{' '}
        <Link
          className="font-semibold hover:underline"
          href={Routes.SITE.LOGIN}
        >
          Login
        </Link>
      </p>
    </form>
  );
}
