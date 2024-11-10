import { redirect } from 'next/navigation';

import { getFavorites } from '@/actions/get-favorites';
import { getMe } from '@/actions/get-me';
import { getPaginatedNodes } from '@/actions/get-nodes';
import { getNodesCount } from '@/actions/get-nodes-count';
import { getSearchNodes } from '@/actions/get-search-nodes';
import { getSearchTags } from '@/actions/get-search-tags';
import { getTags } from '@/actions/get-tags';
import { Footer } from '@/modules/footer/Footer';
import { Header } from '@/modules/header/Header';
import { Routes } from '@/utils/routing';

import Home from './home';

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const me = await getMe();

  if (!me) {
    redirect(Routes.SITE.LOGIN);
  }

  const { tenantId, id: userId } = me;
  const page = Number(searchParams?.page) || 0;
  const query = searchParams.query || '';
  const tag = searchParams.tag || '';

  const body = { tenantId, page };
  const initialNodes = await getPaginatedNodes(body);
  const filteredNodes = await getSearchNodes(tenantId, query);
  const filteredTags = await getSearchTags(tenantId, tag);
  const nodesCount = await getNodesCount(tenantId);
  const tags = await getTags(tenantId);
  const favorites = await getFavorites(userId);

  return (
    <main className="flex h-full min-h-screen flex-col bg-primary">
      <Header user={me} />
      <div className="my-12 grow">
        <Home
          initialNodes={initialNodes}
          filteredNodes={filteredNodes}
          filteredTags={filteredTags}
          nodesCount={nodesCount}
          tags={tags}
          favorites={favorites}
        />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
