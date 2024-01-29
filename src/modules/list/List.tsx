import { AxiosError } from 'axios';
import {
  BadgeAlert,
  BadgeCheck,
  BadgeHelp,
  BadgeInfo,
  ChevronDown,
  PenSquare,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  Badge,
  Button,
  Loader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  errorToast,
} from '@/components';
import { ExtendedNode } from '@/types';
import { Routes, dateOptions, timeOptions } from '@/utils';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  nodes: ExtendedNode[];
  isLoading: boolean;
  isError: boolean;
  error: AxiosError;
  message: string;
};

export const List = ({ nodes, isLoading, isError, error, message }: Props) => {
  if (isLoading) {
    return <Loader size="screen" color="border-secondary" />;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  console.log(nodes);

  return (
    <section className="mt-6">
      {nodes.length > 0 ? (
        <ul className="mx-auto flex w-11/12 list-none flex-col gap-4 md:w-3/4">
          {nodes?.map((node) => (
            <li
              className="relative rounded-md bg-default transition-all duration-300 hover:shadow-lg"
              key={node.id}
            >
              <details>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-6 py-3">
                  <div>
                    <ul className="flex list-none gap-4 text-xs">
                      {node.tags.map((tag) => (
                        <li key={tag.id}>
                          <Badge
                            variant="primary"
                            rounded="full"
                            size="small"
                            style={{ fontVariant: 'small-caps' }}
                          >
                            {tag.label.toLowerCase()}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                    <h2 className="text-2xl font-semibold transition-all duration-300 hover:underline">
                      <Link
                        href={{
                          pathname: '/question/[slug]',
                          query: { slug: node.question.slug, id: node.id },
                        }}
                        as={`/question/${node.question.slug}`}
                      >
                        {node.question.text}
                      </Link>
                    </h2>
                    <div className="flex items-center gap-2">
                      {!node.answer && (
                        <Tooltip>
                          <TooltipTrigger>
                            <BadgeHelp className="h-4 w-4 text-secondary" />
                          </TooltipTrigger>
                          <TooltipContent>Unanswered</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo className="h-4 w-4 text-secondary" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Asked by {node.question.user.name}</p>
                          <p>
                            Asked on{' '}
                            {new Date(node.createdAt).toLocaleDateString(
                              undefined,
                              dateOptions,
                            )}{' '}
                            at{' '}
                            {new Date(node.createdAt).toLocaleTimeString(
                              undefined,
                              timeOptions,
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      {node.answer && (
                        <Tooltip>
                          <TooltipTrigger>
                            <BadgeCheck className="h-4 w-4 text-secondary" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Answered by {node.answer.user.name}</p>
                            <p>
                              Answered on{' '}
                              {new Date(
                                node.answer.updatedAt,
                              ).toLocaleDateString(undefined, dateOptions)}{' '}
                              at{' '}
                              {new Date(
                                node.answer.updatedAt,
                              ).toLocaleTimeString(undefined, timeOptions)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <ChevronDown />
                </summary>
                <hr className="mx-auto my-6 h-px w-3/4 border-none bg-negative" />
                {node.answer ? (
                  <div className="mb-6 px-6">
                    <MarkdownPreview source={node.answer.text} />
                  </div>
                ) : (
                  <div className="mb-6 flex items-center justify-center">
                    <Button
                      variant="primary"
                      size="medium"
                      font="large"
                      weight="bold"
                      className="lowercase"
                      style={{ fontVariant: 'small-caps' }}
                      asChild
                    >
                      <Link
                        href={{
                          pathname: Routes.SITE.ANSWER,
                          query: { id: node.id },
                        }}
                        as={`/question/answer?id=${node.id}`}
                      >
                        Answer
                      </Link>
                    </Button>
                  </div>
                )}
              </details>
              {/* <Button
                variant="ghost"
                size="full"
                font="large"
                weight="bold"
                rounded="bottom"
                className="block border-t border-transparent border-t-default text-center lowercase"
                style={{ fontVariant: 'small-caps' }}
                asChild
              >
                <Link
                  href={{
                    pathname: '/question/[slug]',
                    query: { slug: node.question.slug, id: node.id },
                  }}
                  as={`/question/${node.question.slug}`}
                >
                  Modify
                </Link>
              </Button> */}
            </li>
          ))}
        </ul>
      ) : (
        <p
          className="text-center text-3xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          {message}
        </p>
      )}
    </section>
  );
};
