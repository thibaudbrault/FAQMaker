import { Tenant } from '@prisma/client';

import { Colors } from './Colors';
import { Company } from './Company';
import { Data } from './Data';
import { Integrations } from './Integrations';

type Props = {
  tenantId: string;
  tenant: Tenant;
  isPending: boolean;
};

export const General = ({ tenantId, tenant, isPending }: Props) => {
  return (
    <>
      {tenant.plan !== 'free' && (
        <section className="relative">
          <Colors tenantId={tenantId} />
        </section>
      )}
      <section className="relative">
        <Company tenant={tenant} isPending={isPending} />
      </section>
      {tenant.plan !== 'free' && (
        <section className="relative">
          <Integrations tenantId={tenantId} />
        </section>
      )}
      <section className="relative">
        <Data tenantId={tenantId} plan={tenant.plan} />
      </section>
    </>
  );
};
