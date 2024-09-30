'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Button, Field, Input, successToast } from '@/components';
import { userEmailSchema } from '@/lib/validations';

import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Schema = z.infer<typeof userEmailSchema>;

export default function EmailForm() {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(userEmailSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const { email } = data;
    await signIn('resend', { email });
    successToast(`Link sent to ${data.email}`);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);
  return (
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
              placeholder="john.doe@email.com"
            />
          </Field>
        </div>
      </fieldset>
      <Button variant="primary" size="full" disabled={disabled}>
        Send link
      </Button>
    </form>
  );
}
