import { Tenant } from '@prisma/client';

import { Colors } from './Colors';
import { Company } from './Company';
import { Data } from './Data';
import { Integrations } from './Integrations';

type Props = {
  nodesCount: number;
  usersCount: number;
  tenant: Tenant;
  isTenantLoading: boolean;
};

export const General = ({
  nodesCount,
  usersCount,
  tenant,
  isTenantLoading,
}: Props) => {
  return (
    <>
      {tenant.plan !== 'free' && (
        <section className="relative">
          <Colors />
        </section>
      )}
      <section className="relative">
        <Company tenant={tenant} isPending={isTenantLoading} />
      </section>
      {tenant.plan !== 'free' && (
        <section className="relative">
          <Integrations tenant={tenant} isPending={isTenantLoading} />
        </section>
      )}
      <section className="relative">
        <Data
          nodesCount={nodesCount}
          usersCount={usersCount}
          plan={tenant.plan}
        />
      </section>
    </>
  );
};
