import { Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HelpCircle, MoveLeft, PenSquare } from 'lucide-react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Loader,
  errorToast,
} from '@/components';
import { useNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects, dateOptions } from '@/utils';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

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
      <section className="mx-auto flex w-3/4 flex-col gap-4">
        <div className="flex items-center justify-between">
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
          <DropdownMenu>
            <DropdownMenuTrigger
              className="w-fit rounded-md bg-teal-700 px-4 py-2 font-bold uppercase text-stone-200"
              style={{ fontVariant: 'small-caps' }}
            >
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-stone-100">
              <DropdownMenuItem className="text-base hover:text-teal-700">
                <Link
                  className="flex items-center justify-start gap-2"
                  href={{
                    pathname: '/question/edit',
                    query: { id: node.id },
                  }}
                  as={`/question/edit?id=${node.id}`}
                >
                  <HelpCircle className="w-4" />
                  Question
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base hover:text-teal-700">
                <Link
                  className="flex items-center justify-start gap-2"
                  href={{
                    pathname: '/question/answer',
                    query: { id: node.id },
                  }}
                  as={`/question/answer?id=${node.id}`}
                >
                  <PenSquare className="w-4" />
                  Answer
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md bg-stone-100 p-4">
          <h2 className="text-2xl font-semibold">{node.question.text}</h2>
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
          {node.answer ? (
            <MarkdownPreview
              className="mx-auto w-11/12 text-left"
              source={node.answer.text}
            />
          ) : (
            <p className="text-center italic">No answer</p>
          )}
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
