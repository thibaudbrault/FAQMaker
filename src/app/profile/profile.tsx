'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import {
  UpdateProfile,
  UserAnswers,
  UserFavorites,
  UserQuestions,
} from '@/modules';

import type {
  ExtendedFavorite,
  Me,
  NodeWithQuestionAndAnswer,
  QuestionWithNodeId,
} from '@/types';

type Props = {
  me: Me;
  questions?: QuestionWithNodeId[];
  answers?: NodeWithQuestionAndAnswer[];
  favorites?: ExtendedFavorite[];
};

export default function Profile({ me, questions, answers, favorites }: Props) {
  const tabs = [
    {
      value: 'profile',
      label: 'Profile',
    },
    {
      value: 'questions',
      label: 'Questions',
    },
    {
      value: 'answers',
      label: 'Answers',
    },
    {
      value: 'favorites',
      label: 'Favorites',
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <Tabs defaultValue="profile" className="mt-6 w-full">
        <TabsList className="mx-auto mb-4 w-full justify-center overflow-x-scroll sm:w-fit md:overflow-x-hidden">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              style={{ fontVariant: 'small-caps' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mx-auto flex w-full flex-col gap-4 rounded-md bg-gray-3 p-4 md:w-3/4">
          <TabsContent value="profile">
            <UpdateProfile me={me} />
          </TabsContent>
          <TabsContent value="questions">
            <UserQuestions questions={questions} />
          </TabsContent>
          <TabsContent value="answers">
            <UserAnswers nodes={answers} />
          </TabsContent>
          <TabsContent value="favorites">
            <UserFavorites favorites={favorites} />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
