'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { useTenant } from '@/hooks';
import { Footer, General, Header, Payment, Tags, Users } from '@/modules';
import { UserWithTenant } from '@/types';

type Props = {
  me: UserWithTenant;
};

export default function Settings({ me }: Props) {
  const { data: tenant, isPending } = useTenant(me.tenantId);

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
    <main className="flex h-full min-h-screen flex-col bg-gray-1">
      <Header
        id={me.id}
        company={me.tenant.company}
        logo={me.tenant.logo}
        tenantId={me.tenantId}
      />
      <div className="my-12 flex-grow">
        <section className="mx-auto flex w-11/12 flex-col items-center pb-12 md:w-3/4">
          <h2
            className="font-serif text-5xl lowercase md:text-6xl"
            style={{ fontVariant: 'small-caps' }}
          >
            Settings
          </h2>
          <Tabs defaultValue="general" className="mt-6 w-full">
            <TabsList className="mx-auto mb-4 w-full justify-center overflow-x-scroll sm:w-fit md:overflow-x-hidden">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  style={{ fontVariant: 'small-caps' }}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
              {me.role === 'tenant' && (
                <TabsTrigger
                  value="payment"
                  style={{ fontVariant: 'small-caps' }}
                >
                  Payment
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="general" className="flex flex-col gap-4">
              <General
                tenantId={me.tenantId}
                tenant={tenant}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="tags">
              <Tags tenantId={me.tenantId} plan={tenant.plan} />
            </TabsContent>
            <TabsContent value="users">
              <Users userId={me.id} tenantId={me.tenantId} plan={tenant.plan} />
            </TabsContent>
            <TabsContent value="payment" className="flex flex-col gap-4">
              <Payment tenantId={me.tenantId} company={tenant.company} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
      <Footer company={me.tenant.company} />
    </main>
  );
}
