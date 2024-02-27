import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HelpCircle } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { BackButton, Button, Field, Input, Loader } from '@/components';
import { useMediaQuery, useNode, useTags, useUpdateNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import {
  getMe,
  getNode,
  getTags,
  questionClientSchema,
  ssrNcHandler,
} from '@/lib';
import { TagsList } from '@/modules';
import { UserWithTenant } from '@/types';
import { Limits, QueryKeys, Redirects, arraysAreEqual } from '@/utils';

type Props = {
  me: UserWithTenant;
  id: string;
};

type Schema = z.infer<typeof questionClientSchema>;

function Edit({ me, id }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const { data: tags, isPending: isTagsLoading } = useTags(me.tenantId);
  const { data: node, isPending } = useNode(me.tenantId, id as string);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<Schema>({
    resolver: zodResolver(questionClientSchema),
    mode: 'onBlur',
    defaultValues: {
      text: node?.question.text,
    },
  });

  const router = useRouter();
  const text = watch('text');

  const { mutate } = useUpdateNode(
    id,
    me.tenantId,
    me.id,
    selectedTags,
    router,
    node?.question.id,
  );

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  const tagsId = node?.tags?.map((tag) => tag.id);

  useEffect(() => {
    setSelectedTags(node?.tags?.map((tag) => tag.id));
    setDisabled(isSubmitting || !isValid || !isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, isValid, isDirty]);

  return (
    <PageLayout
      id={me.id}
      company={me.tenant.company}
      logo={me.tenant.logo}
      tenantId={me.tenantId}
    >
      {isPending ? (
        <Loader size="screen" />
      ) : (
        <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
          <BackButton />
          <div className="flex flex-col gap-4 rounded-md bg-gray-3 p-4">
            <form
              className="flex flex-col items-center justify-center gap-4 "
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
                isPending={isTagsLoading}
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
      )}
    </PageLayout>
  );
}

export default Edit;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { id } = query;
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<User | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ME, me.id],
    queryFn: () => me,
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NODE, me.tenantId, id],
    queryFn: () => getNode(me.tenantId, id as string),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.TAGS, me.tenantId],
    queryFn: () => getTags(me.tenantId),
  });

  return {
    props: {
      id,
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
