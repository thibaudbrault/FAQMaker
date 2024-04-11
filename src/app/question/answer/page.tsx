import { getMe } from '@/actions';
import { getNode } from '@/lib';
import { Footer, Header } from '@/modules';
import { Redirects } from '@/utils';

import Answer from './answer';

export default async function Page({ searchParams }) {
  const me = await getMe();

  if (!me) return Redirects.LOGIN;
  const tenantId = me.tenantId;
  const { id } = searchParams;

  const node = await getNode(tenantId, id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 flex-grow">
        <Answer me={me} node={node} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
