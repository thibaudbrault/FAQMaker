import { Button, Input } from '@/components';
import { useUpdateNode } from '@/hooks';
import { ExtendedNode } from '@/types';
import { Question } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';
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
  const { register, handleSubmit, reset, watch } = useForm();

  const { mutate } = useUpdateNode(
    id,
    tenantId,
    node.question.id,
    userId,
    reset,
  );

  const onSubmit = (values: Question) => {
    mutate(values);
  };

  if (isEditingQuestion) {
    return (
      <form
        className="flex justify-between items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register('text', { required: true, min: 3 })}
          value={node.question.text}
          type="text"
          className="bg-stone-100 rounded-md p-1 w-80 border border-stone-200 focus:border-teal-700 outline-none "
        />
        <Button
          variant="primaryDark"
          onClick={() => setIsEditingQuestion(false)}
        >
          Update
        </Button>
      </form>
    );
  } else {
    return (
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">{node.question.text}</h2>
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
