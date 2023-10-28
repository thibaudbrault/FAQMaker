import { useEffect, useMemo, useState } from 'react';

import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { AtSign, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

import { Button, Field, Input, errorToast } from '@/components';
import { useUpdateUser } from '@/hooks';
import { IUserUpdateFields, UserWithTenant } from '@/types';
import { updateUserClientSchema } from '@/lib';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  me: UserWithTenant;
};

type Schema = z.infer<typeof updateUserClientSchema>;

export const UpdateProfile = ({ me }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(updateUserClientSchema),
    mode: 'onBlur',
    defaultValues: {
      name: me.name,
      email: me.email,
    },
  });

  const { mutate, isError, error } = useUpdateUser(me.id, me.tenantId);

  const onSubmit = (values: User) => {
    mutate(values);
  };

  const fields: IUserUpdateFields[] = useMemo(
    () => [
      {
        label: 'Name',
        value: 'name',
        type: 'text',
        icon: <UserIcon className="h-5 w-5" />,
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        icon: <AtSign className="h-5 w-5" />,
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-4"
    >
      <fieldset className="grid w-full grid-cols-4 gap-4">
        <div className="col-span-4 w-full text-center">
          <legend
            className="text-center font-serif text-4xl font-semibold lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            Informations
          </legend>
        </div>
        {me.image ? (
          <Image
            src={me.image}
            alt={'Profile  picture'}
            width={128}
            height={128}
            className="row-start-2 self-center justify-self-center rounded-md"
          />
        ) : (
          <UserIcon className="row-start-2 h-32 w-32 self-center justify-self-center rounded-md" />
        )}
        <ul className="col-span-3 row-start-2 flex flex-col gap-2">
          {fields.map((field) => (
            <li
              key={field.value}
              className="flex flex-col gap-1 [&_svg]:focus-within:text-secondary"
            >
              <Field
                label={field.label}
                value={field.value}
                error={errors[field.value]?.message}
              >
                <Input
                  {...register(field.value)}
                  defaultValue={me[field.value]}
                  withIcon
                  icon={field.icon}
                  type={field.type}
                  id={field.value}
                  placeholder={field.label}
                  className="w-full rounded-md border border-transparent p-1 outline-none focus:border-secondary"
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
        variant={disabled ? 'disabled' : 'primaryDark'}
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
