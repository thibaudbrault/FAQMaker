import { BadgeCheck, BadgeHelp, BadgeInfo, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { ExtendedNode } from '@/types';
import { Routes, dateOptions, timeOptions } from '@/utils';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  nodes: ExtendedNode[];
  message: string;
};

export const List = ({ nodes, message }: Props) => {
  return (
    <section className="mt-6">
      {nodes.length > 0 ? (
        <ul className="mx-auto flex w-11/12 list-none flex-col gap-4 md:w-3/4">
          {nodes?.map((node) => (
            <li
              className="relative rounded-md bg-gray-3 text-gray-12 shadow-gray-9 transition-all duration-300 hover:shadow-lg"
              key={node.id}
            >
              <details>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-6 py-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-semibold ">
                      <Link
                        className="transition-all duration-300 hover:underline"
                        href={`/question/${node.id}`}
                      >
                        {node.question.text}
                      </Link>
                    </h2>
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
                    <div className="flex items-center gap-2">
                      {!node.answer && (
                        <Tooltip>
                          <TooltipTrigger>
                            <BadgeHelp className="h-4 w-4 text-teal-9" />
                          </TooltipTrigger>
                          <TooltipContent>Unanswered</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo className="h-4 w-4 text-teal-9" />
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
                            <BadgeCheck className="h-4 w-4 text-teal-9" />
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
                <hr className="mx-auto mb-6 mt-3 h-px w-3/4 border-none bg-gray-6" />
                {node.answer ? (
                  <div className="mb-6 px-6">
                    <MarkdownPreview
                      className="!bg-transparent"
                      source={node.answer.text}
                    />
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
