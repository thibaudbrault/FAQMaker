import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { General, Payment, Tags, Users } from '@/modules';

import type { Me } from '@/types';
import type { Integrations, Tag, Tenant, User } from '@prisma/client';

type Props = {
  me: Me;
  usersCount: number;
  tagsCount: number;
  tenant: Tenant;
  integrations: Integrations | null;
  tags: Tag[] | null;
  users: User[] | null;
};

export default function Settings({
  me,
  usersCount,
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
    <section className="block space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-primary-muted">
          Manage your account settings and invite users.
        </p>
      </div>
      <hr className="my-6 h-px border-none bg-divider" />
      <Tabs defaultValue="general" className="mt-6 w-full">
        <div className="flex space-x-6">
          <aside className="w-1/5">
            <TabsList className="flex w-full flex-col bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  style={{ fontVariant: 'small-caps' }}
                  className="w-full border-none bg-none text-left"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
              {me.role === 'tenant' && (
                <TabsTrigger
                  value="payment"
                  style={{ fontVariant: 'small-caps' }}
                  className="w-full border-none bg-none text-left"
                >
                  Payment
                </TabsTrigger>
              )}
            </TabsList>
          </aside>
          <div className="flex-1">
            <TabsContent value="general" className="flex w-full flex-col gap-4">
              <General tenant={tenant} integrations={integrations} />
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
          </div>
        </div>
      </Tabs>
    </section>
  );
}
