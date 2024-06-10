'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { updateNode } from '@/actions';
import { BackButton, Button, Field, Input } from '@/components';
import { useMediaQuery } from '@/hooks';
import { createQuestionSchema } from '@/lib';
import { TagsList } from '@/modules';
import { Limits, arraysAreEqual } from '@/utils';

import type { ExtendedNode, Me } from '@/types';
import type { Tag } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  me: Me;
  node: ExtendedNode;
  tags: Tag[];
};

type Schema = z.infer<typeof createQuestionSchema>;

export default function Edit({ me, node, tags }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(createQuestionSchema),
    mode: 'onBlur',
    defaultValues: {
      text: node?.question.text,
    },
  });

  const text = watch('text');

  //   const { mutate } = useUpdateNode(
  //     id,
  //     me.tenantId,
  //     me.id,
  //     selectedTags,
  //     router,
  //     node?.question.id,
  //   );

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append('id', node.id);
    formData.append('tenantId', me.tenantId);
    formData.append('userId', me.id);
    formData.append('questionId', node.question.id);
    formData.append('tags', JSON.stringify(selectedTags));
    await updateNode(formData);
  };

  const tagsId = node?.tags?.map((tag) => tag.id);

  useEffect(() => {
    setSelectedTags(node?.tags?.map((tag) => tag.id));
    setDisabled(isSubmitting || !isValid || !isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, isValid, isDirty]);
  return (
    <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
      <BackButton />
      <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="mx-auto flex w-11/12 flex-col gap-4">
            <div className="w-full text-center">
              <legend
                className="font-serif text-3xl font-semibold lowercase md:text-4xl"
                style={{ fontVariant: 'small-caps' }}
              >
                Edit the question
              </legend>
            </div>
            <Field
              label="Question"
              value="text"
              error={errors?.text?.message}
              hasLimit
              limit={Limits.QUESTION}
              curLength={text.length}
            >
              <Input
                {...register('text')}
                withIcon={isDesktop}
                icon={<HelpCircle />}
                type="text"
                id="question"
              />
            </Field>
          </fieldset>
          <TagsList
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <Button
            variant={
              disabled && arraysAreEqual(tagsId, selectedTags)
                ? 'disabled'
                : 'primary'
            }
            type="submit"
            weight="semibold"
            className="lowercase"
            disabled={disabled && arraysAreEqual(tagsId, selectedTags)}
            style={{ fontVariant: 'small-caps' }}
          >
            Update
          </Button>
        </form>
      </div>
    </section>
  );
}
