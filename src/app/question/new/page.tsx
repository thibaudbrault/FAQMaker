import { redirect } from 'next/navigation';

import { getIntegration, getMe, getTags } from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import New from './new';

export default async function Page() {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);
  const { tenantId } = me;

  const integrations = await getIntegration(tenantId);
  const tags = await getTags(tenantId);
  return (
    <main className="flex h-full min-h-screen flex-col bg-primary">
      <Header user={me} />
      <div className="my-12 grow">
        <New me={me} tags={tags} integrations={integrations} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
