import { redirect } from 'next/navigation';

import { getMe, getNode, getTags } from '@/actions';
import { Footer } from '@/modules/footer/Footer';
import { Header } from '@/modules/header/Header';
import { Routes } from '@/utils/routing';

import Edit from './edit';

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const me = await getMe();

  if (!me) return redirect(Routes.SITE.LOGIN);
  const { tenantId } = me;
  const { id } = searchParams;
  if (!id) return redirect(Routes.SITE.HOME);

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
