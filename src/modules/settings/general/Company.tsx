import { useEffect, useMemo, useState } from 'react';

import { Tenant } from '@prisma/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Input, Label, Loader } from '@/components';
import { useUpdateTenant } from '@/hooks';
import { ITenantFields } from '@/types';

type Props = {
  tenant: Tenant;
  isLoading: boolean;
};

export const Company = ({ tenant, isLoading }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      company: tenant.company,
      email: tenant.email,
    },
  });

  const { mutate } = useUpdateTenant(tenant.id, router);

  const onSubmit = (values: Tenant) => {
    mutate(values);
  };

  const fields: ITenantFields[] = useMemo(
    () => [
      {
        label: 'Company',
        value: 'company',
        type: 'text',
      },
      {
        label: 'Email',
        value: 'email',
        type: 'email',
      },
    ],
    [],
  );

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty);
  }, [isDirty, isSubmitting]);

  if (isLoading) {
    return <Loader size="items" />;
  }

  return (
    <div className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-stone-100 p-4">
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Company
      </h2>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="mx-auto flex w-11/12 gap-2">
          {fields.map((field) => (
            <div
              key={field.value}
              className="flex flex-1 flex-col gap-1 [&_svg]:focus-within:text-teal-700"
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
                defaultValue={tenant[field.value]}
                type={field.type}
                id={field.value}
                placeholder={field.label}
                className="w-full rounded-md border border-transparent p-1 outline-none focus:border-teal-700"
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
    </div>
  );
};
