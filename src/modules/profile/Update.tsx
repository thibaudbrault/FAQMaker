import { useEffect, useMemo, useState } from 'react';

import { Tenant } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { AtSign, UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button, Input, errorToast } from '@/components';
import { useUpdateUser } from '@/hooks';
import { ClientUser, IUserFields } from '@/types';

type Props = {
  me: ClientUser & { tenant: Tenant };
};

export const UpdateProfile = ({ me }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      firstName: me.firstName,
      lastName: me.lastName,
      email: me.email,
    },
  });

  const { mutate, isError, error } = useUpdateUser(me.id, me.tenantId);

  const onSubmit = (values: ClientUser) => {
    mutate(values);
  };

  const fields: IUserFields[] = useMemo(
    () => [
      {
        label: 'First Name',
        value: 'firstName',
        type: 'text',
        icon: <UserIcon className="w-5 h-5" />,
      },
      {
        label: 'Last Name',
        value: 'lastName',
        type: 'text',
        icon: <UserIcon className="w-5 h-5" />,
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
        icon: <AtSign className="w-5 h-5" />,
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty);
  }, [isDirty, isSubmitting]);

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <>
      <h2
        className="text-4xl text-center font-serif font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Informations
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <fieldset className="flex flex-col w-11/12 mx-auto gap-2">
          {fields.map((field) => (
            <div
              key={field.value}
              className="flex flex-col gap-1 [&_svg]:focus-within:text-teal-700"
            >
              <Label
                htmlFor={field.value}
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                {field.label}
              </Label>
              <Input
                {...register(field.value)}
                defaultValue={me[field.value]}
                withIcon
                icon={field.icon}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full border border-transparent outline-none rounded-md p-1 focus:border-teal-700"
              />
            </div>
          ))}
        </fieldset>
        <Button
          variant={disabled ? 'disabledDark' : 'primaryDark'}
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Update
        </Button>
      </form>
    </>
  );
};
