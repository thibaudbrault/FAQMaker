import { redirect } from 'next/navigation';

import { getFavorites } from '@/actions/get-favorites';
import { getMe } from '@/actions/get-me';
import { getUserAnswers } from '@/actions/get-user-answers';
import { getUserQuestions } from '@/actions/get-user-questions';
import { Footer } from '@/modules/footer/Footer';
import { Header } from '@/modules/header/Header';
import { Routes } from '@/utils/routing';

import Profile from './profile';

export default async function Page() {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);

  const questions = await getUserQuestions(me.id);
  const answers = await getUserAnswers(me.id);
  const favorites = await getFavorites(me.id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-primary">
      <Header user={me} />
      <Profile
        me={me}
        questions={questions}
        answers={answers}
        favorites={favorites}
      />
      <Footer company={me.tenant.company} />
    </main>
  );
}
