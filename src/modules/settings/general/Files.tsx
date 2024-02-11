import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tenant } from '@prisma/client';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Field, Input } from '@/components';
import { useUpsertFiles } from '@/hooks';
import { filesClientSchema } from '@/lib';

type Props = {
  tenant: Tenant;
};

type Schema = z.infer<typeof filesClientSchema>;

export const Files = ({ tenant }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string>('');

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(filesClientSchema),
    mode: 'onBlur',
    defaultValues: {
      logo: null,
    },
  });

  const { mutate } = useUpsertFiles(tenant.id);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isDirty || !isValid);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isSubmitting, isValid]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2
        className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Files
      </h2>
      {previewImage && (
        <Image
          src={previewImage}
          alt="logo"
          className="rounded-md border border-default dark:border-negative"
          width={150}
          height={150}
        />
      )}
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-2 md:flex-row">
          <Field label="Logo" value="logo" error={errors.logo?.message}>
            <Controller
              control={control}
              name={'logo'}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Input
                    {...field}
                    onChange={(event) => {
                      onChange(event.target.files[0]);
                      setPreviewImage(
                        URL.createObjectURL(event.target.files[0]),
                      );
                    }}
                    type="file"
                    id="logo"
                    accept="image/jpeg, image/jpg, image/png, image/webp, image/svg"
                  />
                );
              }}
            />
          </Field>
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
