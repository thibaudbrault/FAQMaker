import { useEffect, useState } from 'react';

import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useSearchParams } from 'next/navigation';

import { Pagination } from '@/components';
import {
  useNodes,
  useNodesCount,
  useSearchNodes,
  useSearchTags,
  useTags,
} from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNodes, getNodesCount, getTags, ssrNcHandler } from '@/lib';
import { List, Search } from '@/modules';
import { ExtendedNode, UserWithTenant } from '@/types';
import { OFFSET, QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
};

function Home({ me }: Props) {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    search.get('search') ?? null,
  );
  const [searchTag, setSearchTag] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  let nodes: ExtendedNode[] = [];
  let message = 'Ask a question';
  const {
    data: initialNodes,
    isPending,
    isError,
    error,
  } = useNodes(me.tenantId, page);
  const { data: filteredNodes, isLoading: isSearchLoading } = useSearchNodes(
    me.tenantId,
    searchQuery,
  );
  const { data: filteredTags, isLoading: isTagsLoading } = useSearchTags(
    me.tenantId,
    searchTag,
  );
  const { data: nodesCount } = useNodesCount(me.tenantId);
  const { data: tags } = useTags(me.tenantId);

  if (searchQuery) {
    if (filteredNodes && filteredNodes.length > 0) {
      nodes = filteredNodes;
    } else {
      nodes = [];
      message = 'No results';
    }
  } else if (searchTag) {
    if (filteredTags && filteredTags.length > 0) {
      nodes = filteredTags;
    } else {
      nodes = [];
      message = 'No results';
    }
  } else {
    nodes = initialNodes ?? [];
  }

  const userPreferences = {
    textColor: me.tenant.color.foreground ?? '',
    backgroundColor: me.tenant.color.background ?? '',
    // borderColor: '#0000ff',
  };

  useEffect(() => {
    if (me.tenant.color) {
      document.documentElement.style.setProperty('--color-text', userPreferences.textColor);
      document.documentElement.style.setProperty('--color-background', userPreferences.backgroundColor);
      // document.documentElement.style.setProperty('--color-border', userPreferences.borderColor);
    }
  }, [userPreferences]);

  useEffect(() => {
    setIsLoading(isPending || isSearchLoading);
  }, [isPending, isSearchLoading]);

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <Search
        tags={tags}
        setSearchQuery={setSearchQuery}
        setSearchTag={setSearchTag}
      />
      <List
        nodes={nodes}
        isLoading={isLoading}
        isError={isError}
        error={error}
        message={message}
      />
      {nodesCount > OFFSET && (
        <Pagination nodesLength={nodesCount} setPage={setPage} />
      )}
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
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NODES_COUNT, me.tenantId],
    queryFn: () => getNodesCount(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.TAGS, me.tenantId],
    queryFn: () => getTags(me.tenantId),
  });

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
