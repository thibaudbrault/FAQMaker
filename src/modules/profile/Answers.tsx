import { MoveRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button, Loader } from '@/components';
import { NodeWithQuestionAndAnswer } from '@/hooks';
import { ExtendedNode } from '@/types';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  nodes?: NodeWithQuestionAndAnswer[];
  isPending: boolean;
};

export const UserAnswers = ({ nodes, isPending }: Props) => {
  if (isPending) {
    return <Loader size="page" />;
  }

  return (
    <>
      <h2
        className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Answers
      </h2>
      {nodes && nodes.length > 0 ? (
        <ul className="flex flex-col gap-2 ">
          {nodes.map((node, index) => (
            <li
              className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm"
              key={index}
            >
              <MarkdownPreview source={node.answer.text} />
              <Button variant="secondary" weight="semibold" asChild>
                <Link
                  href={{
                    pathname: '/question/[slug]',
                    query: { slug: node.question.slug, id: node.id },
                  }}
                  as={`/question/${node.question.slug}?id=${node.id}`}
                >
                  <MoveRight />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic">No answers</p>
      )}
    </>
  );
};
