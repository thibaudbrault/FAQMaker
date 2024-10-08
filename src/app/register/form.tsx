'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { createTenantCompanySchema } from '@/actions';
import { Button, Field, Input } from '@/components';
import { registerAtom } from '@/store';
import { Routes } from '@/utils';

import type { ITenantCreateFields } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Schema = z.infer<typeof createTenantCompanySchema>;

export default function Form() {
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(createTenantCompanySchema),
    mode: 'onBlur',
    defaultValues: state,
  });

  const saveData: SubmitHandler<Schema> = (values) => {
    setState({ ...state, ...values });
    router.push(Routes.SITE.REGISTER.USER);
  };

  const fields: ITenantCreateFields[] = [
    {
      label: 'Name',
      value: 'company',
      type: 'text',
    },
    {
      label: 'Email',
      value: 'companyEmail',
      type: 'email',
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(saveData)}
      className="flex w-full flex-col gap-4"
    >
      <fieldset className="flex w-full flex-col gap-4">
        {fields.map((field) => (
          <div key={field.value} className="flex flex-1 flex-col">
            <Field
              key={field.value}
              label={field.label}
              value={field.value}
              info={field.info}
              error={errors?.[field.value]?.message}
            >
              <Input
                {...register(field.value)}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="bg-transparent"
              />
            </Field>
          </div>
        ))}
      </fieldset>
      <div className="flex w-full flex-col items-center justify-between gap-4">
        <Button
          variant="primary"
          size="full"
          icon={true}
          font="large"
          weight="bold"
          disabled={!isValid}
        >
          Next
          <MoveRight />
        </Button>
        <small className="text-center text-xs">
          Already have an account ?{' '}
          <Link
            className="font-semibold hover:underline"
            href={Routes.SITE.LOGIN}
          >
            Login
          </Link>
        </small>
      </div>
    </form>
  );
}
