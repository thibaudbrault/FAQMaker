import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { useUserAnswers, useUserQuestions } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getUserAnswers, getUserQuestions, ssrNcHandler } from '@/lib';
import { UpdateProfile, UserAnswers, UserQuestions } from '@/modules';
import { UserWithTenant } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
};

function Profile({ me }: Props) {
  const { data: questions, isPending: isQuestionsLoading } = useUserQuestions(
    me.id,
  );
  const { data: answers, isPending: isAnswersLoading } = useUserAnswers(me.id);

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <section className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-default p-4">
        <UpdateProfile me={me} />
      </section>
      <section className="mx-auto mb-4 flex w-3/4 flex-col gap-4 rounded-md bg-default p-4">
        <UserQuestions questions={questions} isPending={isQuestionsLoading} />
      </section>
      <section className="mx-auto flex w-3/4 flex-col gap-4 rounded-md bg-default p-4">
        <UserAnswers nodes={answers} isPending={isAnswersLoading} />
      </section>
    </PageLayout>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<User | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ME, me.id],
    queryFn: () => me,
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.QUESTIONS, me.id],
    queryFn: () => getUserQuestions(me.id),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ANSWERS, me.id],
    queryFn: () => getUserAnswers(me.id),
  });

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
