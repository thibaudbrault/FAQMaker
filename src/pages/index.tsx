import { PageLayout } from '@/layouts';
import { getMe, ssrNcHandler } from '@/lib';
import { List, Search } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';
import { Tenant, User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

type Props = {
  me: User & { tenant: Tenant };
};

function Home({ me }: Props) {
  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <Search />
      <List tenantId={me.tenantId} />
    </PageLayout>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
