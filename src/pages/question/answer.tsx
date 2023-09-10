import { useEffect, useState } from 'react';

import { Tenant } from '@prisma/client';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { Button, Editor, Loader } from '@/components';
import { useNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: ClientUser & { tenant: Tenant };
  id: string;
};

function Answer({ me, id }: Props) {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, reset, watch, control } = useForm();

  const {
    data: node,
    isLoading,
    isError,
    error,
  } = useNode(me.tenantId, id as string);

  const answerText = watch('text') ?? '';

  useEffect(() => {
    setDisabled(answerText.length === 0 || answerText === node.answer?.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerText]);

  if (isLoading) {
    return <Loader size="screen" />;
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
            className="flex justify-center items-center flex-col gap-2"
            // onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="text"
              render={({ field: { onChange, value } }) => (
                <Editor value={value} onChange={onChange} />
              )}
            />
            <Button
              variant={disabled ? 'disabledDark' : 'primaryDark'}
              type="submit"
              className="lowercase"
              disabled={disabled}
              style={{ fontVariant: 'small-caps' }}
            >
              {node.answer ? 'Update' : 'Submit'}
            </Button>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}

export default Answer;

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
