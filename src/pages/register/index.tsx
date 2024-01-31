import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Field, Input } from '@/components';
import { AuthLayout } from '@/layouts';
import { registerCompanyClientSchema } from '@/lib';
import { registerAtom } from '@/store';
import { ITenantCreateFields } from '@/types';
import { Routes } from '@/utils';

type Schema = z.infer<typeof registerCompanyClientSchema>;

function Company() {
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(registerCompanyClientSchema),
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
    {
      label: 'Domain',
      value: 'domain',
      type: 'text',
      info: `Fill this field if you have a personalized domain name used for your users' email`,
    },
  ];

  return (
    <AuthLayout hasBackground currentStep={1}>
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
              Company
            </legend>
            <p className="text-sm text-offset">Your company details</p>
          </div>
          {fields.map((field) => (
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
                className="w-full border border-transparent border-b-teal-700 bg-transparent p-1 outline-none placeholder:text-stone-500 focus:rounded-md focus:border-secondary"
              />
            </Field>
          ))}
        </fieldset>
        <Button
          variant={!isValid ? 'disabled' : 'primary'}
          size="full"
          icon="withIcon"
          font="large"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={!isValid}
        >
          Next
          <MoveRight />
        </Button>
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
    </AuthLayout>
  );
}

export default Company;
