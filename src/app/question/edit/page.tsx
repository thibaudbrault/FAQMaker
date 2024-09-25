import { redirect } from 'next/navigation';

import { getMe, getNode, getTags } from '@/actions';
import { Footer, Header } from '@/modules';
import { Routes } from '@/utils';

import Edit from './edit';

export default async function Page({ searchParams }) {
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);
  const { tenantId } = me;
  const { id } = searchParams;

  const node = await getNode(tenantId, id);
  const tags = await getTags(tenantId);
  return (
    <main className="flex h-full min-h-screen flex-col bg-primary">
      <Header user={me} />
      <div className="my-12 grow">
        <Edit me={me} tags={tags} node={node} />
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
