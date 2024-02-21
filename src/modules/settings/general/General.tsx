import { Tenant } from '@prisma/client';

import { Loader } from '@/components';

import { Company } from './Company';
import { Data } from './Data';
import { Files } from './Files';
import { Integrations } from './Integrations';

type Props = {
  tenantId: string;
  tenant: Tenant;
  isPending: boolean;
};

export const General = ({ tenantId, tenant, isPending }: Props) => {
  const styles = 'w-full rounded-md bg-gray-3 p-4';

  if (isPending) {
    return <Loader size="page" />;
  }
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
          <Integrations tenantId={tenantId} />
        </section>
      )}
      <section className="w-full">
        <Data tenantId={tenantId} plan={tenant.plan} />
      </section>
    </>
  );
};
