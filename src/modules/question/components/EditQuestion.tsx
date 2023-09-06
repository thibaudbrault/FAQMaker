import { Button, Input } from '@/components';
import { useUpdateNode } from '@/hooks';
import { ExtendedNode } from '@/types';
import { Question } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  isEditingQuestion: boolean;
  setIsEditingQuestion: Dispatch<SetStateAction<boolean>>;
  node: ExtendedNode;
  id: string;
  tenantId: string;
  userId: string;
};

export const EditQuestion = ({
  isEditingQuestion,
  setIsEditingQuestion,
  node,
  id,
  tenantId,
  userId,
}: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();

  const { mutate, isLoading } = useUpdateNode(
    id,
    tenantId,
    node.question.id,
    userId,
    reset,
  );

  const onSubmit = (values: Question) => {
    setIsEditingQuestion(false);
    mutate(values);
  };

  const questionText = watch('text', '');

  useEffect(() => {
    setDisabled(
      isLoading ||
        questionText.length < 3 ||
        questionText === node.question.text,
    );
  }, [isLoading, questionText]);

  if (isEditingQuestion) {
    return (
      <form
        className="flex justify-between items-end"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register('text', { required: true, min: 3 })}
          defaultValue={node.question.text}
          type="text"
          className="bg-stone-100 rounded-md p-1 w-80 border border-stone-200 focus:border-teal-700 outline-none "
        />
        <div className="flex gap-2">
          <Button
            variant={disabled ? 'disabledDark' : 'primaryDark'}
            type="submit"
            disabled={disabled}
          >
            Update
          </Button>
          <Button
            variant="secondaryDark"
            onClick={() => setIsEditingQuestion(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  } else {
    return (
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-semibold">{node.question.text}</h2>
        <Button
          variant="primaryDark"
          onClick={() => setIsEditingQuestion(true)}
        >
          Edit
        </Button>
      </div>
    );
  }
};
