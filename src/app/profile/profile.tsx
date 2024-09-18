'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import {
  UpdateProfile,
  UserAnswers,
  UserFavorites,
  UserQuestions,
} from '@/modules';

import type {
  ExtendedFavorites,
  Me,
  NodeWithQuestionAndAnswer,
  QuestionWithNodeId,
} from '@/types';

type Props = {
  me: Me;
  questions?: QuestionWithNodeId[];
  answers?: NodeWithQuestionAndAnswer[];
  favorites?: ExtendedFavorites[];
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
    <section className="mx-auto my-12 w-9/12 grow space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold">Profile</h2>
        <p className="text-gray-11">
          Manage your account information and find your questions / answers.
        </p>
      </div>
      <hr className="my-6 h-px border-none bg-divider" />
      <Tabs
        defaultValue="profile"
        className="mt-6 flex h-full w-full grow space-x-6"
      >
        <aside className="h-full w-1/5">
          <TabsList className="flex w-full flex-col bg-transparent">
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
        </aside>
        <div className="flex-1">
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
