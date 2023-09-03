import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Editor,
  Input,
  Label,
  errorToast,
  successToast,
} from '@/components';
import { createAnswer } from '@/data';
import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useCreateAnswer } from '@/hooks';
import { MeContext } from '@/contexts';

type Props = {
  nodeId: string;
  question: string;
  tenantId: string;
};

export const CreateAnswer = ({ nodeId, question, tenantId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();
  const queryClient = useQueryClient();

  const { me } = useContext(MeContext);

  const { mutate, isLoading, isError, error } = useCreateAnswer(
    reset,
    nodeId,
    me.id,
    tenantId,
  );

  const onSubmit = (values: Answer) => {
    mutate(values);
  };

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  const answerText = watch('text', '');

  useEffect(() => {
    setDisabled(isLoading || answerText.length < 3);
  }, [isLoading, answerText]);
  const [value, setValue] = useState('**Hello world!!!**');
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
      <DialogContent className="bg-stone-200/90">
        <DialogHeader>
          <DialogTitle>Answer a question</DialogTitle>
          <DialogDescription>
            Question: <b>{question}</b>
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
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
            <Editor className="bg-white rounded-md" />
            {/* <Input
              withIcon
              icon={<AlertCircle />}
              type="text"
              id="answer"
              placeholder="New answer"
              className="w-full border border-transparent outline-none rounded-md py-1 focus:border-teal-700"
            /> */}
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
