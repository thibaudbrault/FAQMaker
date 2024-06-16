import { redirect } from 'next/navigation';

import { getMe, getNode } from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Question from './question';

export default async function Page({ params }) {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);
  const { tenantId } = me;
  const { id } = params;

  const node = await getNode(tenantId, id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header user={me} />
      <div className="my-12 grow">
        <Question node={node} userId={me.id} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
