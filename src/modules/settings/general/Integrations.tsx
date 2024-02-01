import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Integrations as IntegrationsType, Tenant } from '@prisma/client';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Field, Input, Loader, errorToast } from '@/components';
import { useIntegration, useUpsertIntegrations } from '@/hooks';
import { integrationsClientSchema } from '@/lib';
import { IIntegrations } from '@/types';

type Props = {
  tenantId: string;
};

type Schema = z.infer<typeof integrationsClientSchema>;

export const Integrations = ({ tenantId }: Props) => {
  const { data: integrations, isPending } = useIntegration(tenantId);

  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(integrationsClientSchema),
    mode: 'onBlur',
    defaultValues: {
      slack: integrations?.slack ?? '',
    },
  });

  const { mutate, isError, error } = useUpsertIntegrations(tenantId);

  const onSubmit = (values: IntegrationsType) => {
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
    setDisabled(isSubmitting || !isDirty || !isValid);
  }, [isDirty, isSubmitting, isValid]);

  if (isPending) {
    return <Loader size="items" />;
  }

  if (isError && error instanceof AxiosError) {
    console.error(`Something went wrong: ${error.response.data.message}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
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
              className="flex flex-1 flex-col [&_svg]:focus-within:text-secondary"
            >
              <Field
                label={field.label}
                value={field.value}
                error={errors[field.value]?.message}
              >
                <Input
                  {...register(field.value)}
                  type={field.type}
                  id={field.value}
                  placeholder="https://hooks.slack.com/services/"
                  className="w-full rounded-md border border-transparent p-1 outline-none focus:border-secondary"
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
};
