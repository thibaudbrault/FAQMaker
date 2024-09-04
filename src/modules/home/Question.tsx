'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
import {
  BadgeCheck,
  BadgeHelp,
  BadgeInfo,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Pin,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import {
  createFavorite,
  createPin,
  deleteFavorite,
  deletePin,
} from '@/actions';
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  resultToast,
} from '@/components';
import { favoriteSchema, pinSchema } from '@/lib';
import { userAtom } from '@/store';
import { Routes, dateOptions, timeOptions } from '@/utils';

import type {
  createFavoriteSchema,
  createPinSchema,
  deleteFavoriteSchema,
  deletePinSchema,
} from '@/actions';
import type { ExtendedFavorites, ExtendedNode } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  node: ExtendedNode;
  favorites: ExtendedFavorites[];
};

type SchemaFavorite = z.infer<typeof favoriteSchema>;
type CreateFavorite = z.infer<typeof createFavoriteSchema>;
type DeleteFavorite = z.infer<typeof deleteFavoriteSchema>;

type SchemaPin = z.infer<typeof pinSchema>;
type CreatePin = z.infer<typeof createPinSchema>;
type DeletePin = z.infer<typeof deletePinSchema>;

export default function Question({ node, favorites }: Props) {
  const user = useAtomValue(userAtom);
  const { handleSubmit: handleSubmitFavorite, register: registerFavorite } =
    useForm<SchemaFavorite>({
      resolver: zodResolver(favoriteSchema),
    });
  const { handleSubmit: handleSubmitPin, register: registerPin } =
    useForm<SchemaPin>({
      resolver: zodResolver(pinSchema),
    });

  const onSubmitFavorite: SubmitHandler<SchemaFavorite> = async (data) => {
    if (favorites.some((favorite) => favorite.nodeId === data.nodeId)) {
      const result = await deleteFavorite(data as DeleteFavorite);
      resultToast(result?.serverError, result?.data?.message);
    } else {
      const result = await createFavorite(data as CreateFavorite);
      resultToast(result?.serverError, result?.data?.message);
    }
  };

  const onSubmitPin: SubmitHandler<SchemaPin> = async (data) => {
    if (node.isPinned) {
      const result = await deletePin(data as DeletePin);
      resultToast(result?.serverError, result?.data?.message);
    } else {
      const result = await createPin(data as CreatePin);
      resultToast(result?.serverError, result?.data?.message);
    }
  };

  return (
    <li
      className={`relative rounded-md border bg-gray-3 text-gray-12 shadow-gray-9 transition-all duration-300 hover:shadow-lg ${node.isPinned ? 'border-teal-6' : 'border-transparent'}`}
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
                    <BadgeHelp className="size-4 fill-teal-9 text-gray-12" />
                  </TooltipTrigger>
                  <TooltipContent>Unanswered</TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger>
                  <BadgeInfo className="size-4 fill-teal-9 text-gray-12" />
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
                    <BadgeCheck className="size-4 fill-teal-9 text-gray-12" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Answered by {node.answer.user.name}</p>
                    <p>
                      Answered on{' '}
                      {new Date(node.answer.updatedAt).toLocaleDateString(
                        undefined,
                        dateOptions,
                      )}{' '}
                      at{' '}
                      {new Date(node.answer.updatedAt).toLocaleTimeString(
                        undefined,
                        timeOptions,
                      )}
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
          <form
            onSubmit={handleSubmitFavorite(onSubmitFavorite)}
            className="h-6"
          >
            <input
              type="hidden"
              {...registerFavorite('nodeId', { value: node.id })}
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
                  {favorites.some((favorite) => favorite.nodeId === node.id) ? (
                    <BookmarkCheck className="fill-teal-9" />
                  ) : (
                    <Bookmark />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {favorites.some((favorite) => favorite.nodeId === node.id)
                  ? 'Remove from favorites'
                  : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </form>
          {user?.role !== 'user' && (
            <form onSubmit={handleSubmitPin(onSubmitPin)} className="h-6">
              <input
                type="hidden"
                {...registerPin('nodeId', { value: node.id })}
                hidden
                readOnly
              />
              <input
                type="hidden"
                {...registerPin('tenantId', { value: node.tenantId })}
                hidden
                readOnly
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`text-gray-12 ${node.isPinned ? '' : 'hover:text-gray-11'}`}
                    type="submit"
                    aria-label="Favorite"
                  >
                    <Pin
                      className={`rotate-45 ${node.isPinned ? 'fill-teal-9' : ''}`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {node.isPinned ? 'Unpin question' : 'Pin question'}
                </TooltipContent>
              </Tooltip>
            </form>
          )}
        </div>
      </details>
    </li>
  );
}
