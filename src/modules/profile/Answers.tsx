'use client';

import { MoveRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Routes } from '@/utils';

import type { NodeWithQuestionAndAnswer } from '@/types';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});

type Props = {
  nodes?: NodeWithQuestionAndAnswer[];
};

export const UserAnswers = ({ nodes }: Props) => {
  return (
    <>
      <h2
        className="mb-4 text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Answers
      </h2>
      {nodes && nodes.length > 0 ? (
        <ul className="flex list-none flex-col gap-2">
          {nodes.map((node) => (
            <li
              className="flex items-center justify-between rounded-md px-3 py-2 shadow-sm"
              key={node.id}
            >
              <MarkdownPreview
                source={node.answer.text}
                className="!bg-transparent"
              />

              <Link href={`${Routes.SITE.QUESTION.INDEX}/${node.question.id}`}>
                <MoveRight />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic">No answers</p>
      )}
    </>
  );
};
