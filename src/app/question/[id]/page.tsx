import { redirect } from 'next/navigation';

import { getFavorite, getMe, getNode } from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Question from './question';

export default async function Page({ params }) {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);
  const { tenantId, id: userId } = me;
  const { id } = params;
  if (!id) return redirect(Routes.SITE.HOME);

  const node = await getNode(tenantId, id);
  const favorite = await getFavorite(userId, node.id);
  return (
    <main className="flex h-full min-h-screen flex-col bg-primary">
      <Header user={me} />
      <div className="my-12 grow">
        <Question node={node} favorite={favorite} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
