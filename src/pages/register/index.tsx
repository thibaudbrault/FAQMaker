import { useMemo } from 'react';

import { useAtom } from 'jotai';
import { MoveRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Field, Input } from '@/components';
import { AuthLayout } from '@/layouts';
import { registerAtom } from '@/store';
import { ITenantCreateFields } from '@/types';
import { Routes } from '@/utils';

function Company() {
  const [state, setState] = useAtom(registerAtom);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({ defaultValues: state });

  const saveData = (values) => {
    setState({ ...state, ...values });
    router.push(Routes.SITE.REGISTER.USER);
  };

  const fields: ITenantCreateFields[] = useMemo(
    () => [
      {
        label: 'Name',
        value: 'company',
        type: 'text',
        error: 'Company name is required',
      },
      {
        label: 'Email',
        value: 'companyEmail',
        type: 'email',
        error: 'Company email is required',
      },
    ],
    [],
  );

  return (
    <AuthLayout hasBackground>
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
              error={errors?.[field.value]?.message}
            >
              <Input
                {...register(field.value, {
                  required: field.error,
                })}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full border border-transparent border-b-teal-700 bg-transparent p-1 outline-none placeholder:text-stone-500 focus:rounded-md focus:border-secondary"
              />
            </Field>
          ))}
        </fieldset>
        <Button
          variant={!isValid ? 'disabled' : 'primaryDark'}
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
      </form>
    </AuthLayout>
  );
}

export default Company;
