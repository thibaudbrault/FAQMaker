'use client';

import Link from 'next/link';

import { Routes, dateOptions } from '@/utils';

import type { QuestionWithNodeId } from '@/types';

type Props = {
  questions?: QuestionWithNodeId[];
};

export const UserQuestions = ({ questions }: Props) => {
  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Questions
      </h2>
      {questions && questions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {questions?.map((question) => (
            <Link
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-4"
              key={question.id}
              href={`${Routes.SITE.QUESTION.INDEX}/${question.node.id}`}
            >
              <h3 className="font-semibold">{question.text}</h3>
              <small className="text-gray-11">
                Asked on{' '}
                {new Date(question.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions,
                )}
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center italic">No questions</p>
      )}
    </section>
  );
};
