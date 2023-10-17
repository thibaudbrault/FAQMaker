import { useEffect, useState } from 'react';

import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { useNodes, useSearchNodes } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNodes, ssrNcHandler } from '@/lib';
import { List, Search } from '@/modules';
import { searchQueryAtom } from '@/store';
import { ExtendedNode, UserWithTenant } from '@/types';
import { QueryKeys, Redirects } from '@/utils';
import { useAtomValue } from 'jotai';

type Props = {
  me: UserWithTenant;
};

function Home({ me }: Props) {
  const searchQuery = useAtomValue(searchQueryAtom);
  const [isLoading, setIsLoading] = useState<boolean>();

  let nodes: ExtendedNode[] = [];
  let message = 'Ask a question';
  const {
    data: initialNodes,
    isLoading: isNodesLoading,
    isError,
    error,
  } = useNodes(me.tenantId);
  const { data: filteredNodes, isInitialLoading } = useSearchNodes(
    me.tenantId,
    searchQuery,
  );

  if (searchQuery) {
    if (filteredNodes && filteredNodes.length > 0) {
      nodes = filteredNodes;
    } else {
      nodes = [];
      message = 'No result';
    }
  } else {
    nodes = initialNodes ?? [];
  }

  useEffect(() => {
    setIsLoading(isNodesLoading || isInitialLoading);
  }, [isNodesLoading, isInitialLoading]);

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <Search />
      <List
        nodes={nodes}
        isLoading={isLoading}
        isError={isError}
        error={error}
        message={message}
      />
    </PageLayout>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<User | null>(req, res, callbackMe);

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
