import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { useNodes } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNodes, ssrNcHandler } from '@/lib';
import { General, Tags, Users } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';
import { Tenant, User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useMemo } from 'react';

type Props = {
  me: User & { tenant: Tenant };
};

function Settings({ me }: Props) {
  const { data: nodes } = useNodes(me.tenantId);

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
    'data-[state=active]:bg-teal-700 data-[state=active]:text-stone-200 text-xl lowercase gap-4 font-semibold';

  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <section className="flex flex-col items-center p-4 pb-12">
        <h2
          className="font-serif text-5xl lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Settings
        </h2>
        <Tabs defaultValue="general" className="mt-6 w-full">
          <TabsList className="w-full mb-4">
            {tabs.map((tab) => (
              <TabsTrigger
                value={tab.value}
                className={tabStyle}
                style={{ fontVariant: 'small-caps' }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="general">
            <General nodes={nodes} />
          </TabsContent>
          <TabsContent value="tags">
            <Tags tenantId={me.tenantId} />
          </TabsContent>
          <TabsContent value="users">
            <Users tenantId={me.tenantId} />
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
}

export default Settings;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const callbackMe = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callbackMe);

  if (!me) return Redirects.LOGIN;

  if (me.role !== 'admin') return Redirects.HOME;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);
  await queryClient.prefetchQuery([QueryKeys.NODES, me.tenantId], () =>
    getNodes(me.tenantId),
  );

  return {
    props: {
      me: JSON.parse(JSON.stringify(me)),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
