import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HelpCircle, LinkIcon, PenSquare } from 'lucide-react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  BackButton,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { useNode } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNode, ssrNcHandler } from '@/lib';
import { UserWithTenant } from '@/types';
import { QueryKeys, Redirects, Routes, dateOptions } from '@/utils';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  me: UserWithTenant;
  id: string;
};

function QuestionPage({ me, id }: Props) {
  const { data: node, isPending } = useNode(me.tenantId, id as string);
  const { asPath } = useRouter();

  if (isPending) {
    return <Loader size="screen" />;
  }

  if (node) {
    return (
      <PageLayout
        id={me.id}
        company={me.tenant.company}
        logo={me.tenant.logo}
        tenantId={me.tenantId}
      >
        <section className="mx-auto flex w-11/12 flex-col gap-4 md:w-3/4">
          <div className="flex items-center justify-between">
            <BackButton />
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-fit rounded-md bg-gray-3 px-4 py-2 font-bold uppercase text-gray-12 hover:bg-gray-4"
                style={{ fontVariant: 'small-caps' }}
              >
                Edit
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-1">
                <DropdownMenuItem>
                  <Link
                    className="flex items-center justify-start gap-2"
                    href={{
                      pathname: Routes.SITE.QUESTION.EDIT,
                      query: { id: node.id },
                    }}
                    as={`/question/edit?id=${node.id}`}
                  >
                    <HelpCircle className="w-4" />
                    Question
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    className="flex items-center justify-start gap-2"
                    href={{
                      pathname: Routes.SITE.ANSWER,
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
          <div className="rounded-md bg-gray-3 p-4">
            <ul className="flex list-none gap-2 text-xs">
              {node.tags.map((tag) => (
                <li key={tag.id}>
                  <Badge variant="primary" rounded="full" size="small">
                    {tag.label}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold">{node.question.text}</h2>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="text-gray-12 hover:text-gray-11"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_SITE_URL}${asPath}`,
                      )
                    }
                  >
                    <LinkIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Copy url</TooltipContent>
              </Tooltip>
            </div>
            <hr className="mx-auto my-6 h-px w-3/4 border-none bg-gray-6" />
            {node.answer ? (
              <MarkdownPreview
                className="mx-auto w-11/12 text-left"
                source={node.answer.text}
              />
            ) : (
              <p className="text-center italic">No answer</p>
            )}
            <hr className="mx-auto my-6 h-px w-3/4 border-none bg-gray-6" />
            <div className="flex justify-between">
              <div className="text-xs">
                <p>
                  Asked by <b>{node.question.user.name}</b>
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
                    Answered by <b>{node.answer.user.name}</b>
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
}

export default QuestionPage;

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

  return {
    props: {
      id,
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
