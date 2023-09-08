import { Tenant } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { useNodes } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNodes, ssrNcHandler } from '@/lib';
import { List, Search } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: ClientUser & { tenant: Tenant };
};

function Home({ me }: Props) {
  const { data: nodes, isLoading, isError, error } = useNodes(me.tenantId);
  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <Search />
      <List
        nodes={nodes}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
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
  await queryClient.prefetchQuery([QueryKeys.NODES, me.tenantId], () =>
    getNodes(me.tenantId),
  );

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
