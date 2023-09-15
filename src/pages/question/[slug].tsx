import { Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { MoveLeft } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { Badge, Button, Loader, errorToast } from '@/components';
import { useNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { EditAnswer } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects, dateOptions } from '@/utils';

type Props = {
  me: ClientUser & { tenant: Tenant };
  id: string;
};

function QuestionPage({ me, id }: Props) {
  const {
    data: node,
    isLoading,
    isError,
    error,
  } = useNode(me.tenantId, id as string);

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
          <Link href="/">
            <MoveLeft />
            Go back
          </Link>
        </Button>
        <div className="bg-stone-100 rounded-md p-4">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-semibold">{node.question.text}</h2>
            <Button variant="primaryDark" asChild>
              <Link
                href={{
                  pathname: '/question/edit',
                  query: { id: node.id },
                }}
                as={`/question/edit?id=${node.id}`}
              >
                Edit
              </Link>
            </Button>
          </div>
          <ul className="flex gap-2 text-xs">
            {node.tags.map((tag) => (
              <li key={tag.id}>
                <Badge variant="primary" rounded="full" size="small">
                  {tag.label}
                </Badge>
              </li>
            ))}
          </ul>
          <hr className="my-6 border-teal-700" />
          <EditAnswer answer={node.answer} nodeId={node.id} />
          <hr className="my-6 border-teal-700" />
          <div className="flex justify-between">
            <div className="text-xs">
              <p>
                Asked by{' '}
                <b>
                  {node.question.user.firstName} {node.question.user.lastName}
                </b>
              </p>
              <p>
                Asked on{' '}
                <span>
                  {new Date(node.question.createdAt).toLocaleDateString(
                    undefined,
                    dateOptions,
                  )}
                </span>
              </p>
              <p>
                Updated on{' '}
                <span>
                  {new Date(node.question.updatedAt).toLocaleDateString(
                    undefined,
                    dateOptions,
                  )}
                </span>
              </p>
            </div>
            {node.answer && (
              <div className="text-xs">
                <p>
                  Answered by{' '}
                  <b>
                    {node.answer.user.firstName} {node.answer.user.lastName}
                  </b>
                </p>
                <p>
                  Answered on{' '}
                  <span>
                    {new Date(node.answer.createdAt).toLocaleDateString(
                      undefined,
                      dateOptions,
                    )}
                  </span>
                </p>
                <p>
                  Updated on{' '}
                  <span>
                    {new Date(node.answer.updatedAt).toLocaleDateString(
                      undefined,
                      dateOptions,
                    )}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default QuestionPage;

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
