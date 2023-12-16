import { useEffect, useState } from 'react';

import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useSearchParams } from 'next/navigation';

import { Pagination } from '@/components';
import { useNodes, useSearchNodes } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNodes, ssrNcHandler } from '@/lib';
import { List, Search } from '@/modules';
import { ExtendedNode, UserWithTenant } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
};

function Home({ me }: Props) {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    search.get('search') ?? null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  let nodes: ExtendedNode[] = [];
  let message = 'Ask a question';
  const {
    data: initialNodes,
    isPending,
    isError,
    error,
  } = useNodes(me.tenantId);
  const { data: filteredNodes, isLoading: isSearchloading } = useSearchNodes(
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
    setIsLoading(isPending || isSearchloading);
  }, [isPending, isSearchloading]);

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <Search setSearchQuery={setSearchQuery} />
      <List
        nodes={nodes}
        isLoading={isLoading}
        isError={isError}
        error={error}
        message={message}
      />
      <Pagination nodesLength={nodes.length} setPage={setPage} />
    </PageLayout>
  );
}

export default Home;

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
    queryKey: [QueryKeys.NODES, me.tenantId],
    queryFn: () => getNodes(me.tenantId),
  });

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
