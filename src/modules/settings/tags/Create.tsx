import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  errorToast,
  successToast,
} from '@/components';
import { createNode, createTag } from '@/data';
import user from '@/pages/api/user';
import { Question } from '@prisma/client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { HelpCircle, Tag as TagIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  tenantId: string;
};

export const CreateTag = ({ tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (values: Question) => createTag(values, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ['tags', tenantId],
      });
    },
  });

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
          onSubmit={handleSubmit(mutate)}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex flex-col gap-1 w-11/12 mx-auto">
            <Label
              htmlFor="label"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Label
            </Label>
            <Input
              {...register('label', { required: true, min: 3 })}
              withIcon
              icon={<TagIcon />}
              type="label"
              id="label"
              placeholder="Tag label"
              className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
            />
          </div>
          <Button
            variant={disabled ? 'disabledDark' : 'primaryDark'}
            type="submit"
            disabled={isLoading}
          >
            Add
          </Button>
        </form>
        {/* <DialogFooter className="text-xs justify-start text-center">
          <p>
            {disabled
              ? 'The question must have 3 or more letters'
              : "You're good to post"}
          </p>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};
