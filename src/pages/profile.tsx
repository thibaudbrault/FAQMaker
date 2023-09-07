import { useUserQuestions } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getUserQuestions, ssrNcHandler } from '@/lib';
import { UpdateProfile, UserAnswers, UserQuestions } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';
import { Tenant, User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

type Props = {
  me: User & { tenant: Tenant };
};

function Profile({ me }: Props) {
  const { data: questions, isLoading: isQuestionsLoading } = useUserQuestions(
    me.id,
  );

  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <section className="flex flex-col gap-4 w-3/4 mx-auto bg-stone-100 rounded-md p-4 mb-4">
        <UpdateProfile me={me} />
      </section>
      <section className="flex flex-col gap-4 w-3/4 mx-auto bg-stone-100 rounded-md p-4 mb-4">
        <UserQuestions questions={questions} />
      </section>
      <section className="flex flex-col gap-4 w-3/4 mx-auto bg-stone-100 rounded-md p-4">
        <UserAnswers />
      </section>
    </PageLayout>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);
  await queryClient.prefetchQuery([QueryKeys.QUESTIONS, me.id], () =>
    getUserQuestions(me.id),
  );

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
