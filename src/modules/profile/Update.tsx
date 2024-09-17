'use client';

import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AtSign, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import { updateUser, updateUserSchema } from '@/actions';
import { Button, Field, Input, resultToast } from '@/components';
import { useMediaQuery } from '@/hooks';
import { Limits } from '@/utils';

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
    watch,
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
        limit: Limits.NAME,
        icon: <UserIcon className="size-5" />,
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        limit: Limits.EMAIL,
        icon: <AtSign className="size-5" />,
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Information
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <fieldset className="flex w-full gap-8">
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
          <ul className="flex grow list-none flex-col gap-2">
            {fields.map((field) => (
              <li key={field.value} className="flex flex-col gap-1">
                <Field
                  label={field.label}
                  value={field.value}
                  error={errors[field.value]?.message}
                  curLength={watch(field.value)?.length}
                  limit={field.limit}
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
          variant="primary"
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Update
        </Button>
      </form>
    </section>
  );
};
