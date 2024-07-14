'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { emailSignIn } from '@/actions';
import { Button, Field, Input } from '@/components';
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
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    await emailSignIn(formData);
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
      <Button
        variant={disabled ? 'disabled' : 'primary'}
        weight="semibold"
        className="lowercase"
        size="full"
        style={{ fontVariant: 'small-caps' }}
        disabled={disabled}
      >
        Send link
      </Button>
    </form>
  );
}
