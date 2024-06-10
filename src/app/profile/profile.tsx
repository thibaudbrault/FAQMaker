'use client';

import { UpdateProfile, UserAnswers, UserQuestions } from '@/modules';

import type {
  Me,
  NodeWithQuestionAndAnswer,
  QuestionWithNodeId,
} from '@/types';

type Props = {
  me: Me;
  questions?: QuestionWithNodeId[];
  answers?: NodeWithQuestionAndAnswer[];
};

const Section = ({ children }) => (
  <section className="mx-auto flex w-11/12 flex-col gap-4 rounded-md bg-gray-3 p-4 md:w-3/4">
    {children}
  </section>
);

export default function Profile({ me, questions, answers }: Props) {
  const sections = [
    { component: <UpdateProfile me={me} />, id: 'updateProfile' },
    {
      component: <UserQuestions questions={questions} />,
      id: 'userQuestions',
    },
    { component: <UserAnswers nodes={answers} />, id: 'userAnswers' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <Section key={section.id}>{section.component}</Section>
      ))}
    </div>
  );
}
