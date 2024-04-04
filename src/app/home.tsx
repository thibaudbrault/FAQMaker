'use client';

import { useState, useEffect } from 'react';

import { Search, List } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Props } from 'next/script';

import { Pagination } from '@/components';
import {
  useNodes,
  useSearchNodes,
  useSearchTags,
  useNodesCount,
  useTags,
} from '@/hooks';
import { PageLayout } from '@/layouts';
import { ExtendedNode } from '@/types';
import { OFFSET } from '@/utils';


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
  const { data: filteredTags } = useSearchTags(me.tenantId, searchTag);
  const { data: nodesCount, isPending: isNodesCountLoading } = useNodesCount(
    me.tenantId,
  );
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

  useEffect(() => {
    setIsLoading(isPending || isSearchLoading || isNodesCountLoading);
  }, [isPending, isSearchLoading, isNodesCountLoading]);

  return (
    <PageLayout
      id={me.id}
      company={me.tenant.company}
      logo={me.tenant.logo}
      tenantId={me.tenantId}
    >
      <Search
        tags={tags}
        setSearchQuery={setSearchQuery}
        setSearchTag={setSearchTag}
        setPage={setPage}
      />
      <List
        nodes={nodes}
        isLoading={isLoading}
        isError={isError}
        error={error}
        message={message}
      />
      {nodesCount > OFFSET && (nodes.length === OFFSET || page !== 0) && (
        <Pagination nodesLength={nodesCount} setPage={setPage} />
      )}
    </PageLayout>
  );
}

export default Home;
