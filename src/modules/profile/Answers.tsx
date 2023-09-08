import { Loader } from '@/components';

type Props = {
  answers: {
    answer: {
      text: string;
    };
    question: {
      id: string;
      slug: string;
      text: string;
    };
  }[];
  isLoading: boolean;
};

export const UserAnswers = ({ answers, isLoading }: Props) => {
  if (isLoading) {
    return <Loader size="page" />;
  }

  return (
    <>
      <h2
        className="text-4xl text-center font-serif font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Answers
      </h2>
      {answers.length > 0 ? (
        <ul>
          {answers.map((answer, index) => (
            <li key={index}>
              <p>{answer.answer.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic">No answers</p>
      )}
    </>
  );
};
