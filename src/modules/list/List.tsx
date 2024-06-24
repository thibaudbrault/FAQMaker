'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BadgeCheck,
  BadgeHelp,
  BadgeInfo,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import {
  createFavorite,
  createFavoriteSchema,
  deleteFavorite,
} from '@/actions';
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  resultToast,
} from '@/components';
import { Routes, dateOptions, timeOptions } from '@/utils';

import type { ExtendedFavorites, ExtendedNode } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  nodes: ExtendedNode[];
  message: string;
  favorites: ExtendedFavorites[];
};

type Schema = z.infer<typeof createFavoriteSchema>;

export const List = ({ nodes, message, favorites }: Props) => {
  const { handleSubmit, register } = useForm<Schema>({
    resolver: zodResolver(createFavoriteSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (favorites.some((favorite) => favorite.nodeId === data.nodeId)) {
      const result = await deleteFavorite(data);
      resultToast(result?.serverError, result?.data?.message);
    } else {
      const result = await createFavorite(data);
      resultToast(result?.serverError, result?.data?.message);
    }
  };

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
                    <h2 className="text-3xl font-semibold">
                      <Link
                        className="transition-all duration-300 hover:underline"
                        href={`${Routes.SITE.QUESTION.INDEX}/${node.id}`}
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
                            <BadgeHelp className="size-4 text-teal-9" />
                          </TooltipTrigger>
                          <TooltipContent>Unanswered</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeInfo className="size-4 text-teal-9" />
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
                            <BadgeCheck className="size-4 text-teal-9" />
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
                <hr className="mx-auto mb-6 mt-3 h-px w-3/4 border-none bg-gray-6" />
                <div className="mb-6 flex items-center gap-2 px-6">
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="small" font="small" weight="semibold">
                        {String.fromCodePoint('0x1f604')} React
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Picker data={data} onEmojiSelect={console.log} showPreview={false} />
                    </PopoverContent>
                  </Popover> */}
                  <form onSubmit={handleSubmit(onSubmit)} className="h-6">
                    <input
                      type="hidden"
                      {...register('nodeId', { value: node.id })}
                      hidden
                      readOnly
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`text-gray-12 ${favorites.some((favorite) => favorite.nodeId === node.id) ? '' : 'hover:text-gray-11'}`}
                          type="submit"
                          aria-label="Favorite"
                        >
                          {favorites.some(
                            (favorite) => favorite.nodeId === node.id,
                          ) ? (
                            <BookmarkCheck className="fill-teal-9" />
                          ) : (
                            <Bookmark />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {favorites.some(
                          (favorite) => favorite.nodeId === node.id,
                        )
                          ? 'Remove from favorites'
                          : 'Add to favorites'}
                      </TooltipContent>
                    </Tooltip>
                  </form>
                </div>
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
