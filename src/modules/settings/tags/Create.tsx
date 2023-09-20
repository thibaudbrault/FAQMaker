import { useState } from 'react';

import { Tag } from '@prisma/client';
import { PlusCircle, Tag as TagIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  errorToast,
} from '@/components';
import { useCreateTag } from '@/hooks';

type Props = {
  tenantId: string;
};

export const CreateTag = ({ tenantId }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const { mutate, isError, error } = useCreateTag(tenantId, reset);

  const onSubmit = (values: Tag) => {
    mutate(values);
  };

  if (isError && error instanceof Error) {
    errorToast(error.message);
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
          <DialogTitle>New tag</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-2"
        >
          <fieldset className="mx-auto flex w-11/12 flex-col gap-1 [&_svg]:focus-within:text-teal-700">
            <Label
              htmlFor="label"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Label
            </Label>
            <Input
              {...register('label', { required: true })}
              withIcon
              icon={<TagIcon />}
              type="label"
              id="label"
              placeholder="Tag label"
              className="w-full rounded-md border border-transparent py-1 outline-none focus:border-teal-700"
            />
          </fieldset>
          <Button
            variant={isSubmitting ? 'disabledDark' : 'primaryDark'}
            type="submit"
            disabled={isSubmitting}
          >
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
