'use client';

import { useState } from 'react';

import { Tag } from '@prisma/client';
import { useSearchParams } from 'next/navigation';

import { Pagination } from '@/components';
// import { useSearchNodes, useSearchTags } from '@/hooks';
import { List, Search } from '@/modules';
import { ExtendedNode, Me } from '@/types';
import { OFFSET } from '@/utils';

type Props = {
  me: Me;
  initialNodes: ExtendedNode[];
  nodesCount: number;
  tags: Tag[];
};

export default function Home({ me, initialNodes, nodesCount, tags }: Props) {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    search.get('search') ?? null,
  );
  const [searchTag, setSearchTag] = useState<string>(null);
  const [page, setPage] = useState<number>(0);

  let nodes: ExtendedNode[] = [];
  let message = 'Ask a question';

  // const { data: filteredNodes, isLoading: isSearchLoading } = useSearchNodes(
  //   me.tenantId,
  //   searchQuery,
  // );
  // const { data: filteredTags } = useSearchTags(me.tenantId, searchTag);

  if (searchQuery) {
    //   if (filteredNodes && filteredNodes.length > 0) {
    //     nodes = filteredNodes;
    //   } else {
    //     nodes = [];
    //     message = 'No results';
    //   }
    // } else if (searchTag) {
    //   if (filteredTags && filteredTags.length > 0) {
    //     nodes = filteredTags;
    //   } else {
    //     nodes = [];
    //     message = 'No results';
    //   }
  } else {
    nodes = initialNodes ?? [];
  }

  return (
    <>
      <Search
        tags={tags}
        setSearchQuery={setSearchQuery}
        setSearchTag={setSearchTag}
        setPage={setPage}
      />
      <List nodes={nodes} message={message} />
      {nodesCount > OFFSET && (nodes.length === OFFSET || page !== 0) && (
        <Pagination nodesLength={nodesCount} setPage={setPage} />
      )}
    </>
  );
}
