import { redirect } from 'next/navigation';

import {
  getMe,
  getNodesCount,
  getPaginatedNodes,
  getSearchNodes,
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

  const tenantId = me.tenantId;
  const page = Number(searchParams?.page) || 0;
  const query = searchParams.query || '';

  const body = { tenantId, page };
  const initialNodes = await getPaginatedNodes(body);
  const filteredNodes = await getSearchNodes(tenantId, query);
  const nodesCount = await getNodesCount(tenantId);
  const tags = await getTags(tenantId);

  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 flex-grow">
        <Home
          me={me}
          initialNodes={initialNodes}
          filteredNodes={filteredNodes}
          nodesCount={nodesCount}
          tags={tags}
        />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
