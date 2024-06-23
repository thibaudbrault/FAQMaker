'use client';

import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import { updateUser, updateUserSchema } from '@/actions';
import { Button, Field, Input, resultToast } from '@/components';
import { useMediaQuery } from '@/hooks';

import type { IUserUpdateFields, Me } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  me: Me;
};

type Schema = z.infer<typeof updateUserSchema>;

export const UpdateProfile = ({ me }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onBlur',
    defaultValues: {
      name: me.name ?? '',
      email: me.email,
      role: me.role,
      tenantId: me.tenantId,
      id: me.id,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const result = await updateUser(data);
    resultToast(result?.serverError, result?.data?.message);
  };

  const fields: IUserUpdateFields[] = useMemo(
    () => [
      {
        label: 'Name',
        value: 'name',
        type: 'text',
        icon: <UserIcon className="size-5" />,
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        icon: <AtSign className="size-5" />,
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);
  console.log('🚀 ~ UpdateProfile ~ isValid:', isValid);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4"
    >
      <fieldset className="flex w-full flex-col gap-4 sm:grid sm:grid-cols-4">
        <div className="col-span-4 w-full text-center">
          <legend
            className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
            style={{ fontVariant: 'small-caps' }}
          >
            Informations
          </legend>
        </div>
        {me.image ? (
          <Image
            src={me.image}
            alt="Profile picture"
            width={isDesktop ? 128 : 80}
            height={isDesktop ? 128 : 80}
            className="row-start-2 self-center justify-self-center rounded-md"
          />
        ) : (
          <UserIcon className="row-start-2 size-20 self-center justify-self-center rounded-md sm:size-32" />
        )}
        <ul className="col-span-3 row-start-2 flex list-none flex-col gap-2">
          {fields.map((field) => (
            <li key={field.value} className="flex flex-col gap-1">
              <Field
                label={field.label}
                value={field.value}
                error={errors[field.value]?.message}
              >
                <Input
                  {...register(field.value)}
                  defaultValue={me[field.value] ?? ''}
                  withIcon
                  icon={field.icon}
                  type={field.type}
                  id={field.value}
                  placeholder={field.label}
                />
              </Field>
            </li>
          ))}
          <li>
            <span className="lowercase" style={{ fontVariant: 'small-caps' }}>
              Role:
            </span>{' '}
            <b className="capitalize">{me.role}</b>
          </li>
        </ul>
      </fieldset>
      <Button
        variant={disabled ? 'disabled' : 'primary'}
        weight="semibold"
        className="lowercase"
        style={{ fontVariant: 'small-caps' }}
        disabled={disabled}
      >
        Update
      </Button>
    </form>
  );
};
