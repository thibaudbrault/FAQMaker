'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  HelpCircle,
  PenSquare,
  LinkIcon,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  createFavorite,
  createFavoriteSchema,
  deleteFavorite,
} from '@/actions';
import {
  BackButton,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  resultToast,
} from '@/components';
import { Routes, dateOptions } from '@/utils';

import type { ExtendedNode } from '@/types';
import type { Favorite } from '@prisma/client';
import type { SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  node: ExtendedNode;
  favorite: Favorite;
};

type Schema = z.infer<typeof createFavoriteSchema>;

export default function Question({ node, favorite }: Props) {
  const pathname = usePathname();

  const { handleSubmit } = useForm<Schema>({
    resolver: zodResolver(createFavoriteSchema),
    mode: 'onBlur',
    defaultValues: {
      nodeId: node.id,
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (favorite?.nodeId === node.id) {
      const result = await deleteFavorite(data);
      resultToast(result?.serverError, result?.data?.message);
    } else {
      const result = await createFavorite(data);
      resultToast(result?.serverError, result?.data?.message);
    }
  };

  return (
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
                href={`${Routes.SITE.QUESTION.EDIT}?id=${node.id}`}
              >
                <HelpCircle className="w-4" />
                Question
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex items-center justify-start gap-2"
                href={`${Routes.SITE.ANSWER}?id=${node.id}`}
              >
                <PenSquare className="w-4" />
                Answer
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md bg-gray-3 p-4">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-3xl font-semibold">{node.question.text}</h2>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSubmit(onSubmit)} className="h-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`text-gray-12 ${favorite?.nodeId === node.id ? '' : 'hover:text-gray-11'}`}
                    type="submit"
                    aria-label="Favorite"
                  >
                    {favorite?.nodeId === node.id ? (
                      <BookmarkCheck className="fill-teal-9" />
                    ) : (
                      <Bookmark />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {favorite?.nodeId === node.id
                    ? 'Remove from favorites'
                    : 'Add to favorites'}
                </TooltipContent>
              </Tooltip>
            </form>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-gray-12 hover:text-gray-11"
                  type="button"
                  aria-label="Copy to clipboard"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
                    )
                  }
                >
                  <LinkIcon />
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy URL</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <ul className="flex list-none gap-2 text-xs">
          {node.tags.map((tag) => (
            <li key={tag.id}>
              <Badge variant="primary" rounded="full" size="small">
                {tag.label}
              </Badge>
            </li>
          ))}
        </ul>
        <hr className="mx-auto my-6 h-px w-3/4 border-none bg-gray-6" />
        {node.answer ? (
          <MarkdownPreview
            className="mx-auto w-11/12 !bg-transparent text-left"
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
  );
}
