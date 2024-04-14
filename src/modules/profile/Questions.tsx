'use client';

import Link from 'next/link';

import { QuestionWithNodeId } from '@/types';
import { dateOptions } from '@/utils';

type Props = {
  questions?: QuestionWithNodeId[];
};

export const UserQuestions = ({ questions }: Props) => {
  return (
    <>
      <h2
        className="text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Questions
      </h2>
      {questions && questions.length > 0 ? (
        <ul className="flex list-none flex-col gap-2">
          {questions?.map((question) => (
            <li
              className="flex items-center justify-between rounded-md px-3 py-2 shadow-sm"
              key={question.id}
            >
              <h3 className="text-xl font-semibold hover:underline md:text-2xl">
                <Link href={`/question/${question.node.id}`}>
                  {question.text}
                </Link>
              </h3>
              <p className="text-xs">
                Asked on{' '}
                {new Date(question.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions,
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic">No questions</p>
      )}
    </>
  );
};
