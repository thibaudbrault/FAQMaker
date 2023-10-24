import { useMemo } from 'react';

import { User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { useNodesCount, useTags, useTenant, useUsersCount } from '@/hooks';
import { PageLayout } from '@/layouts';
import {
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
  const { data: nodesCount } = useNodesCount(me.tenantId);
  const { data: usersCount } = useUsersCount(me.tenantId);
  const { data: tenant, isLoading: isTenantLoading } = useTenant(me.tenantId);
  const { data: tags, isLoading: isTagsLoading } = useTags(me.tenantId);

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
              nodesCount={nodesCount}
              usersCount={usersCount}
              tenant={tenant}
              isTenantLoading={isTenantLoading}
            />
          </TabsContent>
          <TabsContent value="tags">
            <Tags
              tags={tags}
              isLoading={isTagsLoading}
              tenantId={me.tenantId}
            />
          </TabsContent>
          <TabsContent value="users">
            <Users meId={me.id} tenantId={me.tenantId} />
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
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);
  await queryClient.prefetchQuery([QueryKeys.NODES_COUNT, me.tenantId], () =>
    getNodesCount(me.tenantId),
  );
  await queryClient.prefetchQuery([QueryKeys.USERS_COUNT, me.tenantId], () =>
    getUsersCount(me.tenantId),
  );
  await queryClient.prefetchQuery([QueryKeys.TENANT, me.tenantId], () =>
    getTenant(me.tenantId),
  );
  await queryClient.prefetchQuery([QueryKeys.TAGS, me.tenantId], () =>
    getTags(me.tenantId),
  );

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
