import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tenant } from '@prisma/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Field, Input, Loader } from '@/components';
import { useUpdateTenant } from '@/hooks';
import { updateTenantClientSchema } from '@/lib';
import { ITenantUpdateFields } from '@/types';

type Props = {
  tenant: Tenant;
  isPending: boolean;
};

type Schema = z.infer<typeof updateTenantClientSchema>;

export const Company = ({ tenant, isPending }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(updateTenantClientSchema),
    mode: 'onBlur',
    defaultValues: {
      company: tenant.company,
      email: tenant.email,
    },
  });

  const { mutate } = useUpdateTenant(tenant.id, router);

  const onSubmit = (values: Tenant) => {
    mutate(values);
  };

  const fields: ITenantUpdateFields[] = useMemo(
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
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  if (isPending) {
    return <Loader size="items" />;
  }

  return (
    <div className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-default p-4">
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
              className="flex flex-1 flex-col gap-1 [&_svg]:focus-within:text-secondary"
            >
              <Field
                label={field.label}
                value={field.value}
                error={errors[field.value]?.message}
              >
                <Input
                  {...register(field.value, { required: true })}
                  defaultValue={tenant[field.value]}
                  type={field.type}
                  id={field.value}
                  placeholder={field.label}
                  className="w-full rounded-md border border-transparent p-1 outline-none focus:border-secondary"
                />
              </Field>
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
          Update
        </Button>
      </form>
    </div>
  );
};
