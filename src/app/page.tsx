import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getAllNodes, getMe, getNodesCount, getTags } from '@/actions';
import { QueryKeys, Routes } from '@/utils';

import Home from './home';

export default async function Page() {
  const me = await getMe();

  if (!me) {
    redirect(Routes.SITE.LOGIN);
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ME, me.id],
    queryFn: () => me,
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NODES, me.tenantId],
    queryFn: () => getAllNodes(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NODES_COUNT, me.tenantId],
    queryFn: () => getNodesCount(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.TAGS, me.tenantId],
    queryFn: () => getTags(me.tenantId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home me={me} />
    </HydrationBoundary>
  );
}
