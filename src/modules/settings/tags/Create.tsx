import { useState } from 'react';

import { Tag } from '@prisma/client';
import { Tag as TagIcon } from 'lucide-react';
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
          font="large"
          size="full"
          weight="bold"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
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
          <fieldset className="flex flex-col gap-1 w-11/12 mx-auto [&_svg]:focus-within:text-teal-700">
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
              className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
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
