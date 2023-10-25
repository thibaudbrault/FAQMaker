import { useEffect, useMemo, useState } from 'react';

import { Tenant } from '@prisma/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Input, Label, Loader } from '@/components';

type Props = {
  tenant: Tenant;
  isPending: boolean;
};

export const Integrations = ({ tenant, isPending }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm();

  const onSubmit = (values: Tenant) => {
    console.log('🚀 ~ file: Integrations.tsx:25 ~ onSubmit ~ values:', values);
  };

  const fields = useMemo(
    () => [
      {
        label: 'Slack',
        value: 'slack',
        type: 'url',
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty);
  }, [isDirty, isSubmitting]);

  if (isPending) {
    return <Loader size="items" />;
  }

  return (
    <div className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-default p-4">
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Integrations
      </h2>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="mx-auto flex w-11/12 gap-2">
          {fields.map((field) => (
            <div
              key={field.value}
              className="flex flex-1 flex-col gap-1 [&_svg]:focus-within:text-secondary"
            >
              <Label
                htmlFor={field.value}
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                {field.label}
              </Label>
              <Input
                {...register(field.value, { required: true })}
                defaultValue={tenant[field.value] ?? ''}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full rounded-md border border-transparent p-1 outline-none focus:border-secondary"
              />
            </div>
          ))}
        </fieldset>
        <Button
          variant={disabled ? 'disabled' : 'primaryDark'}
          weight="semibold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
        >
          Add
        </Button>
      </form>
    </div>
  );
};
