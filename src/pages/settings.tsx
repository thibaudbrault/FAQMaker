import { useNodes } from '@/hooks';
import { PageLayout } from '@/layouts';
import { getMe, getNodes, ssrNcHandler } from '@/lib';
import { General, Tags, Users } from '@/modules';
import { ClientUser } from '@/types';
import { QueryKeys, Redirects } from '@/utils';
import { Tenant, User } from '@prisma/client';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { Tab, TabGroup, TabList, TabPanels } from '@tremor/react';
import { GetServerSideProps } from 'next';

type Props = {
  me: User & { tenant: Tenant };
};

function Settings({ me }: Props) {
  const { data: nodes } = useNodes(me.tenantId);

  return (
    <PageLayout id={me.id} company={me.tenant.company}>
      <section className="flex flex-col items-center p-4 pb-12">
        <h2
          className="font-serif text-5xl lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Settings
        </h2>
        <TabGroup className="mt-6">
          <TabList variant="solid" className="w-full">
            <Tab>General</Tab>
            <Tab>Tags</Tab>
            <Tab>Users</Tab>
          </TabList>
          <TabPanels>
            <General nodes={nodes} />
            <Tags tenantId={me.tenantId} />
            <Users tenantId={me.tenantId} />
          </TabPanels>
        </TabGroup>
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
