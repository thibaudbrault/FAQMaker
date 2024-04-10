import { getMe, getIntegration, getTags } from '@/actions';
import { Footer, Header } from '@/modules';
import { Redirects } from '@/utils';

import New from './new';

export default async function Page() {
  const me = await getMe();

  if (!me) return Redirects.LOGIN;
  const tenantId = me.tenantId;

  const integrations = await getIntegration(tenantId);
  const tags = await getTags(tenantId);
  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 flex-grow">
        <New me={me} tags={tags} integrations={integrations} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
