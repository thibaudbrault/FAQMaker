'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { createNode, createNodeSchema } from '@/actions';
import { BackButton } from '@/components/button/BackButton';
import { Button } from '@/components/button/Button';
import { Field } from '@/components/field/Field';
import { Input } from '@/components/input/Input';
import { resultToast } from '@/components/toast/Toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { PageChangeAlert } from '@/modules/navigation/PageChange';
import { TagsList } from '@/modules/question/TagsList';
import { Me } from '@/types/models/user';
import { Limits } from '@/utils/limits';

import type { Integrations, Tag } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  me: Me;
  tags: Tag[];
  integrations: Integrations | null;
};

type Schema = z.infer<typeof createNodeSchema>;

export default function New({ me, tags, integrations }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const withAnswer = false;

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = useForm<Schema>({
    resolver: zodResolver(createNodeSchema),
    mode: 'onBlur',
    defaultValues: {
      text: '',
      tenantId: me.tenantId,
      integrations,
      withAnswer,
    },
  });
  const text = watch('text');

  useWarnIfUnsavedChanges(isDirty);

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const updatedData = { ...data, tags: selectedTags };
    const result = await createNode(updatedData);
    resultToast(result?.serverError, 'Question created successfully');
  };

  const onSubmitWithAnswer: SubmitHandler<Schema> = async (data) => {
    const updatedData = { ...data, tags: selectedTags, withAnswer: true };
    const result = await createNode(updatedData);
    resultToast(result?.serverError, 'Question created successfully');
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
      <BackButton />
      <div className="flex flex-col gap-4 rounded-md bg-primary-foreground p-4">
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="mx-auto flex w-11/12 flex-col gap-4">
            <div className="w-full text-center">
              <legend
                className="font-serif text-3xl font-semibold lowercase md:text-4xl"
                style={{ fontVariant: 'small-caps' }}
              >
                Ask a question
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
                placeholder="New question"
              />
            </Field>
            <TagsList
              tags={tags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </fieldset>
          <div className="flex items-center justify-center gap-4">
            <Button variant="primary" disabled={disabled} type="submit">
              Submit
            </Button>
            <Button
              variant="ghost"
              icon={true}
              disabled={disabled}
              type="submit"
              onClick={handleSubmit(onSubmitWithAnswer)}
            >
              Answer
              <MoveRight className="size-5" />
            </Button>
          </div>
        </form>
      </div>
      <PageChangeAlert isDirty={isDirty} />
    </section>
  );
}
