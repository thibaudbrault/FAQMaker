import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { General, Payment, Tags, Users } from '@/modules';

import type { Me } from '@/types';
import type { Integrations, Tag, Tenant, User } from '@prisma/client';

type Props = {
  me: Me;
  usersCount: number;
  nodesCount: number;
  tagsCount: number;
  tenant: Tenant;
  integrations: Integrations | null;
  tags: Tag[] | null;
  users: User[] | null;
};

export default function Settings({
  me,
  usersCount,
  nodesCount,
  tagsCount,
  tenant,
  integrations,
  tags,
  users,
}: Props) {
  const tabs = [
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
  ];

  return (
    <section className="mx-auto flex w-11/12 flex-col items-center pb-12 md:w-3/4">
      <h2
        className="font-serif text-5xl lowercase md:text-6xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Settings
      </h2>
      <Tabs defaultValue="general" className="mt-6 w-full">
        <TabsList className="mx-auto mb-4 w-full justify-center overflow-x-scroll sm:w-fit md:overflow-x-hidden">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              style={{ fontVariant: 'small-caps' }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
          {me.role === 'tenant' && (
            <TabsTrigger value="payment" style={{ fontVariant: 'small-caps' }}>
              Payment
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="general" className="flex flex-col gap-4">
          <General
            tenant={tenant}
            integrations={integrations}
            nodesCount={nodesCount}
            usersCount={usersCount}
          />
        </TabsContent>
        <TabsContent value="tags">
          <Tags
            tenantId={me.tenantId}
            plan={tenant.plan}
            tags={tags}
            tagsCount={tagsCount}
          />
        </TabsContent>
        <TabsContent value="users">
          <Users
            users={users}
            userId={me.id}
            usersCount={usersCount}
            tenantId={me.tenantId}
            plan={tenant.plan}
          />
        </TabsContent>
        <TabsContent value="payment" className="flex flex-col gap-4">
          <Payment tenantId={me.tenantId} company={tenant.company} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
