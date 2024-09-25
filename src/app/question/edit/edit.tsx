'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { updateNode, updateNodeSchema } from '@/actions';
import { BackButton, Button, Field, Input, resultToast } from '@/components';
import { useMediaQuery } from '@/hooks';
import { PageChangeAlert, TagsList } from '@/modules';
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

type Schema = z.infer<typeof updateNodeSchema>;

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
    resolver: zodResolver(updateNodeSchema),
    mode: 'onBlur',
    defaultValues: {
      text: node?.question.text,
      id: node.id,
      tenantId: me.tenantId,
      questionId: node.question.id,
    },
  });

  const text = watch('text');

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const updatedData = { ...data, selectedTags };
    const result = await updateNode(updatedData);
    resultToast(result?.serverError, 'Question updated successfully');
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
      <div className="flex flex-col gap-4 rounded-md bg-primary-foreground p-4">
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
            variant="primary"
            type="submit"
            disabled={disabled && arraysAreEqual(tagsId, selectedTags)}
          >
            Update
          </Button>
        </form>
      </div>
      <PageChangeAlert isDirty={isDirty} />
    </section>
  );
}
