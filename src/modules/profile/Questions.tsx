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
  questions: QuestionWithNodeId[];
  isPending: boolean;
};

export const UserQuestions = ({ questions, isPending }: Props) => {
  if (isPending) {
    return <Loader size="page" />;
  }

  return (
    <>
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Questions
      </h2>
      {questions.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {questions.map((question) => (
            <li
              className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm"
              key={question.id}
            >
              <h3 className="text-2xl font-semibold hover:underline">
                <Link
                  href={{
                    pathname: '/question/[slug]',
                    query: { slug: question.slug, id: question.node.id },
                  }}
                  as={`/question/${question.slug}?id=${question.node.id}`}
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
