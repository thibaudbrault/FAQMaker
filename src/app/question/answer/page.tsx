import { redirect } from 'next/navigation';

import { getMe, getNode } from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Answer from './answer';

export default async function Page({ searchParams }) {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);
  const { tenantId } = me;
  const { id } = searchParams;

  const node = await getNode(tenantId, id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 grow">
        <Answer me={me} node={node} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
