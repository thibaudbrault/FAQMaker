import { redirect } from 'next/navigation';

import { getMe, getNodesCount, getPaginatedNodes, getTags } from '@/actions';
import { Routes } from '@/utils';

import Home from './home';

export default async function Page({ searchParams }) {
  const me = await getMe();

  if (!me) {
    redirect(Routes.SITE.LOGIN);
  }

  const tenantId = me.tenantId;
  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;

  const body = { tenantId, page };
  const allNodes = await getPaginatedNodes(body);
  const nodesCount = await getNodesCount(tenantId);
  const tags = await getTags(tenantId);

  return (
    <Home me={me} allNodes={allNodes} nodesCount={nodesCount} tags={tags} />
  );
}
