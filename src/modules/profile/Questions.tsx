import { dateOptions } from '@/utils';
import { Question } from '@prisma/client';
import Link from 'next/link';

type QuestionWithNodeId = Question & {
  node: {
    id: string;
  };
};

type Props = {
  questions: QuestionWithNodeId[];
};

export const UserQuestions = ({ questions }: Props) => {
  return (
    <>
      <h2
        className="text-4xl text-center font-serif font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Questions
      </h2>
      <ul className="flex flex-col gap-2">
        {questions.map((question) => (
          <li
            className="flex items-center justify-between shadow-sm rounded-md bg-stone-50 border border-teal-700 px-3 py-2"
            key={question.id}
          >
            <h3 className="text-2xl font-semibold">
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
    </>
  );
};
