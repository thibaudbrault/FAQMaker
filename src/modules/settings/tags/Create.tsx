import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tag } from '@prisma/client';
import { AxiosError } from 'axios';
import { PlusCircle, Tag as TagIcon } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  errorToast,
} from '@/components';
import { useCreateTag } from '@/hooks';
import { createTagClientSchema } from '@/lib';

type Props = {
  tenantId: string;
};

type Schema = z.infer<typeof createTagClientSchema>;

export const CreateTag = ({ tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(createTagClientSchema),
    mode: 'onBlur',
    defaultValues: {
      label: '',
    },
  });

  const { mutate, isError, error } = useCreateTag(tenantId, reset);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  if (isError && error instanceof AxiosError) {
    const errorMessage = error.response?.data.message || 'An error occurred';
    errorToast(errorMessage);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primaryDark"
          icon="withIcon"
          font="large"
          size="full"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          <PlusCircle />
          New tag
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/90">
        <DialogHeader>
          <DialogTitle className="text-2xl">New tag</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-2"
        >
          <fieldset className="mx-auto flex w-11/12 flex-col gap-1 [&_svg]:focus-within:text-secondary">
            <Field label="Label" value="label" error={errors.label?.message}>
              <Input
                {...register('label')}
                withIcon
                icon={<TagIcon />}
                type="label"
                id="label"
                placeholder="Tag label"
                className="w-full rounded-md border border-transparent py-1 outline-none focus:border-secondary"
              />
            </Field>
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
      </DialogContent>
    </Dialog>
  );
};
