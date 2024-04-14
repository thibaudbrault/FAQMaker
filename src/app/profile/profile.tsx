'use client';

import { UpdateProfile, UserAnswers, UserQuestions } from '@/modules';
import { Me, NodeWithQuestionAndAnswer, QuestionWithNodeId } from '@/types';

type Props = {
  me: Me;
  questions?: QuestionWithNodeId[];
  answers?: NodeWithQuestionAndAnswer[];
};

export default function Profile({ me, questions, answers }: Props) {
  const sections = [
    { component: <UpdateProfile me={me} /> },
    {
      component: <UserQuestions questions={questions} />,
    },
    { component: <UserAnswers nodes={answers} /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <Section key={index}>{section.component}</Section>
      ))}
    </div>
  );
}

const Section = ({ children }) => (
  <section className="mx-auto flex w-11/12 flex-col gap-4 rounded-md bg-gray-3 p-4 md:w-3/4">
    {children}
  </section>
);
