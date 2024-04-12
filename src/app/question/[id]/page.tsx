import { getMe, getNode } from '@/actions';
import { Footer, Header } from '@/modules';
import { Redirects } from '@/utils';

import Question from './question';

export default async function Page({ params }) {
  const me = await getMe();

  if (!me) return Redirects.LOGIN;
  const tenantId = me.tenantId;
  const { id } = params;

  const node = await getNode(tenantId, id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 flex-grow">
        <Question node={node} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
