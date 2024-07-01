'use client';

import { useSearchParams } from 'next/navigation';

import { Pagination } from '@/components';
import { List, Search } from '@/modules';
import { OFFSET } from '@/utils';

import type { ExtendedFavorites, ExtendedNode } from '@/types';
import type { $Enums, Tag } from '@prisma/client';

type Props = {
  initialNodes: ExtendedNode[];
  filteredNodes: ExtendedNode[];
  filteredTags: ExtendedNode[];
  nodesCount: number;
  tags: Tag[];
  favorites: ExtendedFavorites[];
  role: $Enums.Role;
};

export default function Home({
  initialNodes,
  filteredNodes,
  filteredTags,
  nodesCount,
  tags,
  favorites,
  role,
}: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const tag = searchParams.get('tag') || '';
  const page = searchParams.get('page') || 0;

  let nodes: ExtendedNode[] = [];
  let message = 'Ask a question';

  if (query) {
    if (filteredNodes && filteredNodes.length > 0) {
      nodes = filteredNodes;
    } else {
      nodes = [];
      message = 'No results';
    }
  } else if (tag) {
    if (filteredTags && filteredTags.length > 0) {
      nodes = filteredTags;
    } else {
      nodes = [];
      message = 'No results';
    }
  } else {
    nodes = initialNodes ?? [];
  }

  return (
    <>
      <Search tags={tags} />
      <List nodes={nodes} message={message} favorites={favorites} role={role} />
      {nodesCount > OFFSET && (nodes.length === OFFSET || page !== 0) && (
        <Pagination nodesLength={nodesCount} />
      )}
    </>
  );
}
