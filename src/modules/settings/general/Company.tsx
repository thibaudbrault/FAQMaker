'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tenant } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateTenant } from '@/actions';
import { Button, Field, Input } from '@/components';
import { updateTenantClientSchema } from '@/lib';
import { ITenantUpdateFields } from '@/types';

type Props = {
  tenant: Tenant;
};

type Schema = z.infer<typeof updateTenantClientSchema>;

export function Company({ tenant }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
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
      domain: tenant.domain,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('id', tenant.id);
    await updateTenant(formData);
  };

  const fields: ITenantUpdateFields[] = [
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
    {
      label: 'Domain',
      value: 'domain',
      type: 'text',
    },
  ];

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Company
      </h2>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-2 md:flex-row">
          {fields.map((field) => (
            <div key={field.value} className="flex flex-1 flex-col">
              <Field
                label={field.label}
                value={field.value}
                error={errors[field.value]?.message}
              >
                <Input
                  {...register(field.value)}
                  type={field.type}
                  id={field.value}
                  placeholder={field.label}
                />
              </Field>
            </div>
          ))}
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
    </div>
  );
}
