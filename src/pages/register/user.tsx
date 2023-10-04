import { useMemo } from 'react';

import { MoveRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Field, Input } from '@/components';
import { useRegisterState } from '@/contexts';
import { AuthLayout } from '@/layouts';

function Register() {
  const [state, setState] = useRegisterState();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm({ defaultValues: state });
  const watchPassword = watch('password');

  const saveData = (values) => {
    setState({ ...state, ...values });
    router.push('/register/confirm');
  };

  const fields = useMemo(
    () => [
      {
        label: 'First Name',
        value: 'firstName',
        type: 'text',
        error: 'First name is required',
      },
      {
        label: 'Last Name',
        value: 'lastName',
        type: 'text',
        error: 'Last name is required',
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        error: 'Email is required',
      },
      {
        label: 'Password',
        value: 'password',
        type: 'password',
        error: 'Password is required',
      },
    ],
    [],
  );

  //   if (isError && error instanceof Error) {
  //     errorToast(error.message);
  //   }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(saveData)}
        className="flex min-w-[500px] flex-col items-center gap-8 rounded-md bg-green-50 p-8"
      >
        <fieldset className="flex w-full flex-col gap-4">
          <div className="mb-4 flex w-full flex-col gap-2 text-center">
            <legend
              className="font-serif text-5xl font-bold lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              User
            </legend>
            <p className="text-sm">Your profile details</p>
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
                className="w-full border border-transparent border-b-teal-700 bg-transparent p-1 outline-none placeholder:text-stone-500 focus:rounded-md focus:border-teal-700"
              />
            </Field>
          ))}
          <Field
            label="Confirm password"
            value="confirmPassword"
            error={errors?.confirmPassword}
          >
            <Input
              {...register('confirmPassword', {
                required: 'Confirm the password',
                validate: (value) =>
                  value === watchPassword || 'The passwords do not match',
              })}
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              className="w-full border border-transparent border-b-teal-700 bg-transparent p-1 outline-none placeholder:text-stone-500 focus:rounded-md focus:border-teal-700"
            />
          </Field>
        </fieldset>
        <Button
          variant={!isValid ? 'disabledDark' : 'primaryDark'}
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

export default Register;
