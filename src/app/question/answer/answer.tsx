'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createAnswer } from '@/actions';
import { BackButton, Button, Editor } from '@/components';
import { answerClientSchema } from '@/lib';
import { ExtendedNode, Me } from '@/types';
import { Limits } from '@/utils';


type Props = {
  me: Me;
  node: ExtendedNode;
};

type Schema = z.infer<typeof answerClientSchema>;

export default function Answer({ me, node }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = useForm<Schema>({
    resolver: zodResolver(answerClientSchema),
    mode: 'onBlur',
    defaultValues: {
      text: node?.answer?.text ?? '',
      nodeId: node.id,
      userId: me.id,
    },
  });

  const text = watch('text');

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (node?.answer) {
      await updateAnswer(formData);
    } else {
      await createAnswer(formData);
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
