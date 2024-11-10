import { redirect } from 'next/navigation';


import { getIntegration } from '@/actions/get-integration';
import { getMe } from '@/actions/get-me';
import { getTags } from '@/actions/get-tags';
import { getTagsCount } from '@/actions/get-tags-count';
import { getTenant } from '@/actions/get-tenant';
import { getUsers } from '@/actions/get-users';
import { getUsersCount } from '@/actions/get-users-count';
import { Footer } from '@/modules/footer/Footer';
import { Header } from '@/modules/header/Header';
import { Routes } from '@/utils/routing';

import Settings from './settings';

export default async function Page() {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);

  if (me.role === 'user') return redirect(Routes.SITE.HOME);
  const { tenantId } = me;

  const usersCount = await getUsersCount(tenantId);
  const tagsCount = await getTagsCount(tenantId);
  const tenant = await getTenant(tenantId);
  const integrations = await getIntegration(tenantId);
  const tags = await getTags(tenantId);
  const users = await getUsers(tenantId);

  return (
    <main className="flex h-full min-h-screen flex-col bg-primary">
      <Header user={me} />
      <div className="mx-auto my-12 w-9/12 grow">
        <Settings
          me={me}
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
