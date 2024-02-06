import { ExtendedTenant } from '@/types';

import { Colors } from './Colors';
import { Company } from './Company';
import { Data } from './Data';
import { Integrations } from './Integrations';

type Props = {
  tenantId: string;
  tenant: ExtendedTenant;
  isPending: boolean;
};

export const General = ({ tenantId, tenant, isPending }: Props) => {
  return (
    <>
      {tenant.plan !== 'free' && (
        <section className="w-full rounded-md bg-default p-4 dark:bg-negative">
          <Colors colors={tenant.color} tenantId={tenantId} />
        </section>
      )}
      <section className="w-full rounded-md bg-default p-4 dark:bg-negative">
        <Company tenant={tenant} isPending={isPending} />
      </section>
      {tenant.plan !== 'free' && (
        <section className="w-full rounded-md bg-default p-4 dark:bg-negative">
          <Integrations tenantId={tenantId} />
        </section>
      )}
      <section className="w-full">
        <Data tenantId={tenantId} plan={tenant.plan} />
      </section>
    </>
  );
};
