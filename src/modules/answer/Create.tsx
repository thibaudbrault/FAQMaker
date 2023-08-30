import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@/components';
import { createAnswer } from '@/data';
import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  nodeId: string;
  question: string;
  tenantId: string;
};

export const CreateAnswer = ({ nodeId, question, tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (values: Answer) => createAnswer(values, nodeId),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: ['nodes', tenantId],
      });
    },
  });

  const answerText = watch('text', '');

  useEffect(() => {
    setDisabled(isLoading || answerText.length < 3);
  }, [isLoading, answerText]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="primaryDark"
          font="large"
          size="small"
          className="font-semibold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Answer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-stone-200/80">
        <DialogHeader>
          <DialogTitle className="font-serif">Answer a question</DialogTitle>
          <DialogDescription>Question: {question}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(mutate)}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex flex-col gap-1 w-11/12 mx-auto">
            <Label
              htmlFor="Answer"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
            >
              Answer
            </Label>
            <Input
              {...register('text', { required: true, min: 3 })}
              withIcon
              icon={<AlertCircle />}
              type="text"
              id="answer"
              placeholder="New answer"
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
              ? 'The answer must have 3 or more letters'
              : "You're good to post"}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
