import { useEffect, useState } from 'react';

import { Question, Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button, Input, Loader } from '@/components';
import { useNode, useUpdateNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: ClientUser & { tenant: Tenant };
  id: string;
};

function Edit({ me, id }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch } = useForm();

  const {
    data: node,
    isLoading,
    isError,
    error,
  } = useNode(me.tenantId, id as string);

  const { mutate, isLoading: mutateIsLoading } = useUpdateNode(
    id,
    me.tenantId,
    node.question.id,
    reset,
  );

  const onSubmit = (values: Question) => {
    mutate(values);
  };

  const questionText = watch('text', '');

  useEffect(() => {
    setDisabled(
      mutateIsLoading ||
        questionText.length < 3 ||
        questionText === node.question.text,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateIsLoading, questionText]);

  if (isLoading) {
    return <Loader size="screen" />;
  }

  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <section className="flex flex-col gap-4 w-3/4 mx-auto">
        <Button
          variant="primaryDark"
          weight="semibold"
          size="medium"
          icon="withIcon"
          font="large"
          asChild
          className="w-fit lowercase"
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
            className="flex justify-center items-center flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              {...register('text', { required: true, min: 3 })}
              defaultValue={node.question.text}
              type="text"
              className="bg-stone-100 rounded-md p-1 w-80 border border-stone-200 focus:border-teal-700 outline-none "
            />
            <Button
              variant={disabled ? 'disabledDark' : 'primaryDark'}
              type="submit"
              className="w-fit"
              disabled={disabled}
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

  return {
    props: {
      id,
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
