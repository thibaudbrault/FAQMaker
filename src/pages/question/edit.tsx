import { SetStateAction, useEffect, useState } from 'react';

import { Question, Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HelpCircle, MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Button, Input, Label, Loader, errorToast } from '@/components';
import { useNode, useTags, useUpdateNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, getTags, ssrNcHandler } from '@/lib';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects, arraysAreEqual } from '@/utils';
import { TagsList } from '@/modules';

type Props = {
  me: ClientUser & { tenant: Tenant };
  id: string;
};

function Edit({ me, id }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm();
  const router = useRouter();

  const { data: tags, isLoading: isTagsLoading } = useTags(me.tenantId);
  const {
    data: node,
    isLoading,
    isError,
    error,
  } = useNode(me.tenantId, id as string);

  const { mutate } = useUpdateNode(
    id,
    me.tenantId,
    node.question.id,
    me.id,
    selectedTags,
    router,
  );

  const onSubmit = (values: Question) => {
    mutate(values);
  };

  const questionText = watch('text', '');
  const tagsId = node.tags.map((tag) => tag.id);

  useEffect(() => {
    setSelectedTags(node.tags.map((tag) => tag.id));
    setDisabled(
      isSubmitting ||
        questionText.length < 3 ||
        questionText === node.question.text,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, questionText]);

  if (isLoading) {
    return <Loader size="screen" />;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <section className="flex flex-col gap-4 w-3/4 mx-auto">
        <Button
          variant="primaryDark"
          weight="semibold"
          icon="withIcon"
          font="large"
          asChild
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          <Link
            href={{
              pathname: '/question/[slug]',
              query: { slug: node.question.slug, id: node.id },
            }}
            as={`/question/${node.question.slug}?id=${node.id}`}
          >
            <MoveLeft />
            Go back
          </Link>
        </Button>
        <div className="flex flex-col bg-stone-100 rounded-md p-4 gap-4">
          <h2
            className="text-4xl text-center font-serif font-semibold lowercase"
            style={{ fontVariant: 'small-caps' }}
          >
            Edit the question
          </h2>
          <form
            className="flex justify-center items-center flex-col gap-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="flex flex-col gap-1 w-11/12 mx-auto [&_svg]:focus-within:text-teal-700">
              <Label
                htmlFor="question"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                Question
              </Label>
              <Input
                {...register('text', { required: true, min: 3 })}
                defaultValue={node.question.text}
                withIcon
                icon={<HelpCircle />}
                type="text"
                id="question"
                className="w-full rounded-md p-1 border border-stone-200 focus:border-teal-700 outline-none "
              />
            </fieldset>
            <TagsList
              isLoading={isTagsLoading}
              tags={tags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            <Button
              variant={
                disabled && arraysAreEqual(tagsId, selectedTags)
                  ? 'disabledDark'
                  : 'primaryDark'
              }
              type="submit"
              className="lowercase"
              disabled={disabled && arraysAreEqual(tagsId, selectedTags)}
              style={{ fontVariant: 'small-caps' }}
            >
              Update
            </Button>
          </form>
        </div>
      </section>
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
  const me = await ssrNcHandler<ClientUser | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);
  await queryClient.prefetchQuery([QueryKeys.NODE, me.tenantId, id], () =>
    getNode(me.tenantId, id as string),
  );
  await queryClient.prefetchQuery([QueryKeys.TAGS, me.tenantId], () =>
    getTags(me.tenantId),
  );

  return {
    props: {
      id,
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
