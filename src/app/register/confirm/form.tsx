'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createTenant, createTenantSchema } from '@/actions';
import { Button, resultToast } from '@/components';
import { registerAtom } from '@/store';
import { Routes } from '@/utils';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Schema = z.infer<typeof createTenantSchema>;

export default function Form() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: state,
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const result = await createTenant(data);
    resultToast(result?.serverError, result?.data?.message);
    if (!result?.serverError && result?.data?.customerId) {
      const { customerId } = result.data;
      setState({ ...state, customerId });
      router.push(Routes.SITE.REGISTER.PLAN);
    }
  };

  useEffect(() => {
    setDisabled(!isValid || isSubmitting);
  }, [isValid, isSubmitting]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <fieldset className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-1 text-center">
          <legend
            className="font-serif text-5xl font-bold lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            Confirm
          </legend>
          <p className="text-sm text-primary-muted">Confirm the information</p>
        </div>
        <div>
          <p className="mb-2 text-xl font-bold">Company</p>
          <div className="grid grid-cols-4 grid-rows-1 gap-4">
            <p className="text-sm">Name</p>
            <p className="col-span-3 font-bold">{state.company}</p>
          </div>
          <div className="grid grid-cols-4 grid-rows-1 gap-4">
            <p className="text-sm">Email</p>
            <p className="col-span-3 font-bold">{state.companyEmail}</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xl font-bold">User</p>
          <div className="grid grid-cols-4 grid-rows-1 gap-8">
            <p className="text-sm">Email</p>
            <p className="col-span-3 font-bold">{state.email}</p>
          </div>
        </div>
      </fieldset>
      <div className="flex w-full items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="full"
          icon="withIcon"
          font="large"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          type="button"
          onClick={() => router.push(Routes.SITE.REGISTER.USER)}
        >
          <MoveLeft />
          Previous
        </Button>
        <Button
          variant="primary"
          size="full"
          font="large"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
