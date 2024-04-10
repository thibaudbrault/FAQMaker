import {
  getIntegration,
  getMe,
  getNodesCount,
  getTags,
  getTenant,
  getUsers,
  getUsersCount,
} from '@/actions';
import { SuspenseWrapper } from '@/lib';
import { Footer, Header } from '@/modules';
import { Redirects } from '@/utils';

import Settings from './settings';

export default async function Page() {
  const me = await getMe();

  if (!me) return Redirects.LOGIN;

  if (me.role === 'user') return Redirects.HOME;
  const tenantId = me.tenantId;

  const nodesCount = await getNodesCount(tenantId);
  const usersCount = await getUsersCount(tenantId);
  const tenant = await getTenant(tenantId);
  const integrations = await getIntegration(tenantId);
  const tags = await getTags(tenantId);
  const users = await getUsers(tenantId);

  return (
    <SuspenseWrapper loaderType="screen">
      <main className="flex h-full min-h-screen flex-col bg-gray-1">
        <Header user={me} />
        <div className="my-12 flex-grow">
          <Settings
            me={me}
            nodesCount={nodesCount}
            usersCount={usersCount}
            tenant={tenant}
            integrations={integrations}
            tags={tags}
            users={users}
          />
        </div>
        <Footer company={me.tenant.company} />
      </main>
    </SuspenseWrapper>
  );
}
