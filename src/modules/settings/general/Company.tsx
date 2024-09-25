'use client';

import { Fragment, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { updateTenant, updateTenantSchema } from '@/actions';
import { Button, Field, Input, resultToast } from '@/components';
import { PageChangeAlert } from '@/modules';
import { Limits } from '@/utils';

import type { ITenantUpdateFields } from '@/types';
import type { Integrations, Tenant } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenant: Tenant;
  integrations: Integrations | null;
};

type Schema = z.infer<typeof updateTenantSchema>;

export function Company({ tenant, integrations }: Props) {
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
      slack: integrations?.slack ?? '',
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
    <div className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Company
      </h2>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex w-full flex-col">
          <div className="space-y-1">
            {fields.map((field) => (
              <Fragment key={field.value}>
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
              </Fragment>
            ))}
            {tenant.plan !== 'free' && (
              <Field label="Slack" value="slack" error={errors.slack?.message}>
                <Input
                  {...register('slack')}
                  type="text"
                  id="slack"
                  placeholder="https://hooks.slack.com/services/"
                />
              </Field>
            )}
          </div>
        </fieldset>
        <Button variant="primary" disabled={disabled}>
          Update
        </Button>
      </form>
      <PageChangeAlert isDirty={isDirty} />
    </div>
  );
}
