import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import {
  getIntegration,
  getMe,
  getNodesCount,
  getTags,
  getTenant,
  getUsersCount,
} from '@/actions';
import { SuspenseWrapper } from '@/lib';
import { QueryKeys, Redirects } from '@/utils';

import Settings from './settings';

export default async function Page() {
  const me = await getMe();

  if (!me) return Redirects.LOGIN;

  if (me.role === 'user') return Redirects.HOME;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.ME, me.id],
    queryFn: () => me,
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.NODES_COUNT, me.tenantId],
    queryFn: () => getNodesCount(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.USERS_COUNT, me.tenantId],
    queryFn: () => getUsersCount(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.TENANT, me.tenantId],
    queryFn: () => getTenant(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.INTEGRATION, me.tenantId],
    queryFn: () => getIntegration(me.tenantId),
  });
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.TAGS, me.tenantId],
    queryFn: () => getTags(me.tenantId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SuspenseWrapper loaderType="screen">
        <Settings me={me} />
      </SuspenseWrapper>
    </HydrationBoundary>
  );
}
