import { useEffect, useMemo, useState } from 'react';

import { useAtom } from 'jotai';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Field, Input } from '@/components';
import { AuthLayout } from '@/layouts';
import { registerAtom } from '@/store';
import { IUserFields } from '@/types';

function Register() {
  const [state, setState] = useAtom(registerAtom);
  const [disabled, setDisabled] = useState<boolean>(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm({ defaultValues: state });

  const saveData = (values) => {
    setState({ ...state, ...values });
    router.push('/register/confirm');
  };

  const fields: IUserFields[] = useMemo(
    () => [
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        error: 'Email is required',
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(!isValid || isSubmitting);
  }, [isValid, isSubmitting]);

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
              User
            </legend>
            <p className="text-sm text-offset">Your connection mail</p>
          </div>
          {fields.map((field) => (
            <Field
              key={field.value}
              label={field.label}
              value={field.value}
              error={errors?.[field.value]}
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
            onClick={() => router.push('/register')}
          >
            <MoveLeft />
            Previous
          </Button>
          <Button
            variant={disabled ? 'disabled' : 'primaryDark'}
            size="full"
            icon="withIcon"
            font="large"
            weight="bold"
            className="lowercase"
            style={{ fontVariant: 'small-caps' }}
            disabled={disabled}
            type="submit"
          >
            Next
            <MoveRight />
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;
