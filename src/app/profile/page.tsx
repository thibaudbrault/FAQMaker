import { redirect } from 'next/navigation';

import {
  getFavorites,
  getMe,
  getUserAnswers,
  getUserQuestions,
} from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Profile from './profile';

export default async function Page() {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);

  const questions = await getUserQuestions(me.id);
  const answers = await getUserAnswers(me.id);
  const favorites = await getFavorites(me.id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 grow">
        <Profile
          me={me}
          questions={questions}
          answers={answers}
          favorites={favorites}
        />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
