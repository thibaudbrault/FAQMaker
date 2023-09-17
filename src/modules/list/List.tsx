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
};

export const List = ({ nodes, isLoading, isError, error }: Props) => {
  if (isLoading) {
    return <Loader size="screen" color="border-teal-700" />;
  }

  if (isError && error instanceof Error) {
    errorToast(error.message);
  }

  return (
    <section className="mt-6">
      {nodes.length > 0 ? (
        <ul className="w-3/4 mx-auto flex flex-col gap-6">
          {nodes.map((node) => (
            <li
              className="relative bg-stone-100 border border-teal-700 rounded-md"
              key={node.id}
            >
              <details>
                <summary className="flex items-center justify-between px-6 py-3 list-none cursor-pointer">
                  <div>
                    <h2 className="font-semibold text-2xl">
                      {node.question.text}
                    </h2>
                    <ul className="flex text-xs gap-4">
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
                <hr className="w-3/4 my-6 mx-auto h-px bg-teal-700 border-none" />
                <div className="px-6 mb-6">
                  {node.answer ? (
                    <MarkdownPreview source={node.answer.text} />
                  ) : (
                    <p className="text-center italic">No answer</p>
                  )}
                </div>
              </details>
              <Button
                variant="secondaryDark"
                size="full"
                font="large"
                weight="bold"
                rounded="bottom"
                className="lowercase block text-center border-transparent border-t border-t-teal-700"
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
          className="text-center text-2xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Ask a question
        </p>
      )}
    </section>
  );
};
