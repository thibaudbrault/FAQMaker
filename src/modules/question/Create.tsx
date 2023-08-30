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
import { createNode } from '@/data';
import { Question, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  user: User;
};

export const CreateQuestion = ({ user }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (values: Question) => createNode(values, user),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ['nodes', user.tenantId],
      });
    },
  });

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  const questionText = watch('text', '');

  useEffect(() => {
    setDisabled(isLoading || questionText.length < 3);
  }, [isLoading, questionText]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primaryLight"
          font="large"
          size="small"
          className="font-semibold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          New Question
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/90">
        <DialogHeader>
          <DialogTitle className="font-serif">New question</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(mutate)}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex flex-col gap-1 w-11/12 mx-auto">
            <Label
              htmlFor="question"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Question
            </Label>
            <Input
              {...register('text', { required: true, min: 3 })}
              withIcon
              icon={<HelpCircle />}
              type="text"
              id="question"
              placeholder="New question"
              className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
            />
          </div>
          <Button
            variant={disabled ? 'disabledDark' : 'primaryDark'}
            type="submit"
            disabled={disabled}
          >
            Submit
          </Button>
        </form>
        <DialogFooter className="text-xs justify-start text-center">
          <p>
            {disabled
              ? 'The question must have 3 or more letters'
              : "You're good to post"}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
