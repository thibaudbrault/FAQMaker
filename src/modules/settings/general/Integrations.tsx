import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tenant } from '@prisma/client';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Field, Input, Loader, errorToast } from '@/components';
import { useUpsertIntegrations } from '@/hooks';
import { integrationsClientSchema } from '@/lib';
import { IIntegrations } from '@/types';

type Props = {
  tenant: Tenant;
  isPending: boolean;
};

type Schema = z.infer<typeof integrationsClientSchema>;

export const Integrations = ({ tenant, isPending }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Schema>({
    resolver: zodResolver(integrationsClientSchema),
    mode: 'onBlur',
  });

  const { mutate, isError, error } = useUpsertIntegrations(tenant.id);

  const onSubmit = (values: Tenant) => {
    mutate(values);
  };

  const fields: IIntegrations[] = useMemo(
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

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
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
              <Field
                label={field.label}
                value={field.value}
                error={errors[field.value]?.message}
              >
                <Input
                  {...register(field.value)}
                  defaultValue={tenant[field.value] ?? ''}
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
          Add
        </Button>
      </form>
    </div>
  );
};
