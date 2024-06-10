import { redirect } from 'next/navigation';

import {
  getMe,
  getNodesCount,
  getPaginatedNodes,
  getSearchNodes,
  getSearchTags,
  getTags,
} from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Home from './home';

export default async function Page({ searchParams }) {
  const me = await getMe();

  if (!me) {
    redirect(Routes.SITE.LOGIN);
  }

  const { tenantId } = me;
  const page = Number(searchParams?.page) || 0;
  const query = searchParams.query || '';
  const tag = searchParams.tag || '';

  const body = { tenantId, page };
  const initialNodes = await getPaginatedNodes(body);
  const filteredNodes = await getSearchNodes(tenantId, query);
  const filteredTags = await getSearchTags(tenantId, tag);
  const nodesCount = await getNodesCount(tenantId);
  const tags = await getTags(tenantId);

  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 grow">
        <Home
          initialNodes={initialNodes}
          filteredNodes={filteredNodes}
          filteredTags={filteredTags}
          nodesCount={nodesCount}
          tags={tags}
        />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
