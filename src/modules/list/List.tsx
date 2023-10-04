import { AxiosError } from 'axios';
import { ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Badge, Button, Loader, errorToast } from '@/components';
import { ExtendedNode } from '@/types';
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

  return (
    <section className="mt-6">
      {nodes.length > 0 ? (
        <ul className="mx-auto flex w-3/4 flex-col gap-6">
          {nodes.map((node) => (
            <li
              className="relative rounded-md border border-secondary bg-stone-100"
              key={node.id}
            >
              <details>
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-3">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {node.question.text}
                    </h2>
                    <ul className="flex gap-4 text-xs">
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
                  </div>
                  <ChevronDown />
                </summary>
                <hr className="mx-auto my-6 h-px w-3/4 border-none bg-negative" />
                <div className="mb-6 px-6">
                  {node.answer ? (
                    <MarkdownPreview source={node.answer.text} />
                  ) : (
                    <p className="text-center italic">No answer</p>
                  )}
                </div>
              </details>
              <Button
                variant="secondary"
                size="full"
                font="large"
                weight="bold"
                rounded="bottom"
                className="block border-t border-transparent border-t-teal-700 text-center lowercase"
                style={{ fontVariant: 'small-caps' }}
                asChild
              >
                <Link
                  href={{
                    pathname: '/question/[slug]',
                    query: { slug: node.question.slug, id: node.id },
                  }}
                  as={`/question/${node.question.slug}?id=${node.id}`}
                >
                  Modify
                </Link>
              </Button>
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
