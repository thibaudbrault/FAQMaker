import { Integrations as IntegrationsType, Tenant } from '@prisma/client';

import { Company } from './Company';
import { Data } from './Data';
import { Files } from './Files';
import { Integrations } from './Integrations';

type Props = {
  tenantId: string;
  tenant: Tenant;
  integrations: IntegrationsType;
  nodesCount: number;
  usersCount: number;
};

export const General = ({
  tenantId,
  tenant,
  integrations,
  nodesCount,
  usersCount,
}: Props) => {
  const styles = 'w-full rounded-md bg-gray-3 p-4';

  return (
    <>
      <section className={styles}>
        <Company tenant={tenant} />
      </section>
      <section className={styles}>
        <Files tenant={tenant} />
      </section>
      {tenant.plan !== 'free' && (
        <section className={styles}>
          <Integrations tenantId={tenantId} integrations={integrations} />
        </section>
      )}
      <section className="w-full">
        <Data
          tenantId={tenantId}
          plan={tenant.plan}
          nodesCount={nodesCount}
          usersCount={usersCount}
        />
      </section>
    </>
  );
};
