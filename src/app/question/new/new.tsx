'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { createNode } from '@/actions';
import { BackButton, Button, Field, Input } from '@/components';
import { useMediaQuery } from '@/hooks';
import { questionClientSchema } from '@/lib';
import { TagsList } from '@/modules';
import { Limits } from '@/utils';

import type { Me } from '@/types';
import type { Integrations, Tag } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

type Props = {
  me: Me;
  tags: Tag[];
  integrations: Integrations;
};

type Schema = z.infer<typeof questionClientSchema>;

export default function New({ me, tags, integrations }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const withAnswer = true;

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(questionClientSchema),
    mode: 'onBlur',
    defaultValues: {
      text: '',
      tenantId: me.tenantId,
      userId: me.id,
    },
  });
  const text = watch('text');

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append('tags', JSON.stringify(selectedTags));
    await createNode(integrations, formData);
  };

  const onSubmitWithAnswer: SubmitHandler<Schema> = (data) => {
    const values = { ...data, withAnswer };
  };

  useEffect(() => {
    setDisabled(isSubmitting || !isValid);
  }, [isSubmitting, isValid]);

  return (
    <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
      <BackButton />
      <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
        <form className="flex flex-col items-center gap-4">
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
            <Button
              variant={disabled ? 'disabled' : 'primary'}
              weight="semibold"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
              disabled={disabled}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
            <Button
              variant={disabled ? 'disabled' : 'ghost'}
              icon="withIcon"
              weight="semibold"
              className="lowercase"
              style={{ fontVariant: 'small-caps' }}
              disabled={disabled}
              onClick={handleSubmit(onSubmitWithAnswer)}
            >
              Answer
              <MoveRight className="size-5" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
