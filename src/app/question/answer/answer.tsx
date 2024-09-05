'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { createAnswer, updateAnswer } from '@/actions';
import { BackButton, Button, Editor, resultToast } from '@/components';
import { answerSchema } from '@/lib';
import { Limits } from '@/utils';

import type { createAnswerSchema, updateAnswerSchema } from '@/actions';
import type { ExtendedNode } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  node: ExtendedNode;
};

type Schema = z.infer<typeof answerSchema>;
type CreateAnswer = z.infer<typeof createAnswerSchema>;
type UpdateAnswer = z.infer<typeof updateAnswerSchema>;

export default function Answer({ node }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = useForm<Schema>({
    resolver: zodResolver(answerSchema),
    mode: 'onBlur',
    defaultValues: {
      text: node?.answer?.text ?? '',
    },
  });

  const text = watch('text');

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (node?.answer) {
      const updateData: UpdateAnswer = {
        text: data.text,
        id: node.answer.id,
      };
      const result = await updateAnswer(updateData);
      resultToast(result?.serverError, 'Answer updated successfully');
    } else {
      const createData: CreateAnswer = {
        text: data.text,
        nodeId: node.id,
      };
      const result = await createAnswer(createData);
      resultToast(result?.serverError, 'Answer created successfully');
    }
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid || !isDirty);
  }, [isSubmitting, isValid, isDirty]);

  return (
    <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
      <BackButton />
      <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
        <h2
          className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
          style={{ fontVariant: 'small-caps' }}
        >
          {node.answer ? 'Edit the answer' : 'Answer'}
        </h2>
        <form
          className="flex flex-col items-center justify-center gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex w-full flex-col justify-start gap-px">
            <p className="text-sm">
              Question: <b>{node.question.text}</b>
            </p>
            <Controller
              control={control}
              name="text"
              render={({ field: { onChange, value } }) => (
                <Editor value={value} onChange={onChange} />
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              {errors.text && (
                <small className="col-start-1 justify-self-start text-sm text-red-9">
                  {errors.text.message}
                </small>
              )}
              <small className="col-start-2 justify-self-end text-xs text-gray-11">
                {text.length} / {Limits.ANSWER}
              </small>
            </div>
          </div>
          <Button
            variant={disabled ? 'disabled' : 'primary'}
            type="submit"
            weight="semibold"
            className="lowercase"
            disabled={disabled}
            style={{ fontVariant: 'small-caps' }}
          >
            {node.answer ? 'Update' : 'Submit'}
          </Button>
        </form>
      </div>
    </section>
  );
}
