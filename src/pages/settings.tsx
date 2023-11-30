import { useMemo } from 'react';

import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { useNodesCount, useTags, useTenant, useUsersCount } from '@/hooks';
import { PageLayout } from '@/layouts';
import {
  getIntegration,
  getMe,
  getNodesCount,
  getTags,
  getTenant,
  getUsersCount,
  ssrNcHandler,
} from '@/lib';
import { General, Tags, Users } from '@/modules';
import { UserWithTenant } from '@/types';
import { QueryKeys, Redirects } from '@/utils';

type Props = {
  me: UserWithTenant;
};

function Settings({ me }: Props) {
  const { data: tenant, isPending } = useTenant(me.tenantId);

  const tabs = useMemo(
    () => [
      {
        value: 'general',
        label: 'General',
      },
      {
        value: 'tags',
        label: 'Tags',
      },
      {
        value: 'users',
        label: 'Users',
      },
    ],
    [],
  );

  const tabStyle =
    'data-[state=active]:bg-negative data-[state=active]:text-negative text-xl lowercase font-semibold';

  return (
    <PageLayout id={me.id} company={me.tenant.company} tenantId={me.tenantId}>
      <section className="flex flex-col items-center p-4 pb-12">
        <h2
          className="font-serif text-6xl lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Settings
        </h2>
        <Tabs defaultValue="general" className="mt-6 w-full">
          <TabsList className="mb-4 w-full">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className={tabStyle}
                style={{ fontVariant: 'small-caps' }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="general">
            <General
              tenantId={me.tenantId}
              tenant={tenant}
              isPending={isPending}
            />
          </TabsContent>
          <TabsContent value="tags">
            <Tags tenantId={me.tenantId} />
          </TabsContent>
          <TabsContent value="users">
            <Users userId={me.id} tenantId={me.tenantId} />
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}

export default Settings;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<User | null>(req, res, callbackMe);

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

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
