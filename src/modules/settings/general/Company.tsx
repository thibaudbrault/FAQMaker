'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { updateTenant, updateTenantSchema } from '@/actions';
import { Button, Field, Input, resultToast } from '@/components';
import { Limits } from '@/utils';

import type { ITenantUpdateFields } from '@/types';
import type { Tenant } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenant: Tenant;
};

type Schema = z.infer<typeof updateTenantSchema>;

export function Company({ tenant }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(updateTenantSchema),
    mode: 'onBlur',
    defaultValues: {
      company: tenant.company,
      email: tenant.email,
      id: tenant.id,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const result = await updateTenant(data);
    resultToast(result?.serverError, 'Tenant updated successfully');
  };

  const fields: ITenantUpdateFields[] = [
    {
      label: 'Company',
      value: 'company',
      type: 'text',
      limit: Limits.COMPANY,
    },
    {
      label: 'Email',
      value: 'email',
      type: 'email',
      limit: Limits.EMAIL,
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
                curLength={watch(field.value)?.length}
                limit={field.limit}
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
