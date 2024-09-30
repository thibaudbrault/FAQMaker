'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { dateOptions, Routes } from '@/utils';

import type { NodeWithQuestionAndAnswer } from '@/types';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  nodes?: NodeWithQuestionAndAnswer[];
};

export const UserAnswers = ({ nodes }: Props) => {
  console.log(nodes);
  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Answers
      </h2>
      {nodes && nodes.length > 0 ? (
        <div className="flex flex-col gap-2">
          {nodes.map((node) => (
            <Link
              href={`${Routes.SITE.QUESTION.INDEX}/${node.question.id}`}
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-primary-foreground-hover"
              key={node.id}
            >
              <MarkdownPreview
                source={node.answer.text}
                className="!bg-transparent"
              />
              <small className="text-primary-muted">
                Answered on{' '}
                {new Date(node.answer.updatedAt).toLocaleDateString(
                  undefined,
                  dateOptions,
                )}
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center italic">No answers</p>
      )}
    </section>
  );
};
