import { redirect } from 'next/navigation';

import {
  getIntegration,
  getMe,
  getNodesCount,
  getTags,
  getTagsCount,
  getTenant,
  getUsers,
  getUsersCount,
} from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Settings from './settings';

export default async function Page() {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);

  if (me.role === 'user') return redirect(Routes.SITE.HOME);
  const tenantId = me.tenantId;

  const nodesCount = await getNodesCount(tenantId);
  const usersCount = await getUsersCount(tenantId);
  const tagsCount = await getTagsCount(tenantId);
  const tenant = await getTenant(tenantId);
  const integrations = await getIntegration(tenantId);
  const tags = await getTags(tenantId);
  const users = await getUsers(tenantId);

  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 flex-grow">
        <Settings
          me={me}
          nodesCount={nodesCount}
          tagsCount={tagsCount}
          usersCount={usersCount}
          tenant={tenant}
          integrations={integrations}
          tags={tags}
          users={users}
        />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
