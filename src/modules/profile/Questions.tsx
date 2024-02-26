import { Question } from '@prisma/client';
import Link from 'next/link';

import { Loader } from '@/components';
import { dateOptions } from '@/utils';

type QuestionWithNodeId = Question & {
  node: {
    id: string;
  };
};

type Props = {
  questions?: QuestionWithNodeId[];
  isPending: boolean;
};

export const UserQuestions = ({ questions, isPending }: Props) => {
  if (isPending) {
    return <Loader size="items" />;
  }

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
                <Link
                  href={{
                    pathname: '/question/[id]',
                    query: { id: question.node.id },
                  }}
                >
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
