'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { upsertIntegrations, upsertIntegrationsSchema } from '@/actions';
import { Button, Field, Input, resultToast } from '@/components';

import type { IIntegrations } from '@/types';
import type { Integrations as IntegrationsType } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  tenantId: string;
  integrations: IntegrationsType | null;
};

type Schema = z.infer<typeof upsertIntegrationsSchema>;

export function Integrations({ tenantId, integrations }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(upsertIntegrationsSchema),
    mode: 'onBlur',
    defaultValues: {
      slack: integrations?.slack ?? '',
      tenantId,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const result = await upsertIntegrations(data);
    resultToast(result?.serverError, 'Integrations updated successfully');
  };

  const fields: IIntegrations[] = [
    {
      label: 'Slack',
      value: 'slack',
      type: 'url',
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
        Integrations
      </h2>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="mx-auto flex w-11/12 gap-2">
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
                  placeholder="https://hooks.slack.com/services/"
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
