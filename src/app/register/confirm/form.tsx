'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createTenant } from '@/actions';
import { Button } from '@/components';
import { useCreateCustomer } from '@/hooks';
import { registerCompleteClientSchema } from '@/lib';
import { registerAtom } from '@/store';
import { Routes } from '@/utils';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Schema = z.infer<typeof registerCompleteClientSchema>;

export default function Form() {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(registerCompleteClientSchema),
    defaultValues: state,
  });

  const {
    data: customerId,
    mutateAsync: mutateCustomer,
    isSuccess: customerIsSuccess,
  } = useCreateCustomer();

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    await createTenant(formData);
    // await mutateCustomer(data);
  };

  // useEffect(() => {
  //   if (customerIsSuccess) {
  //     setState({ ...state, customerId });
  //     router.push(Routes.SITE.REGISTER.PLAN);
  //   }
  // }, [customerIsSuccess, customerId]);

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
          <p className="text-sm text-gray-11">Confirm the information</p>
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
          <div className="grid grid-cols-4 grid-rows-1 gap-4">
            <p className="text-sm">Domain</p>
            <p
              className={`col-span-3 ${state.domain ? 'font-bold' : 'italic'}`}
            >
              {state.domain || 'No domain'}
            </p>
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
          variant={disabled ? 'disabled' : 'primary'}
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
