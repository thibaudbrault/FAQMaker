import { Loader } from '@/components';
import { ExtendedTenant } from '@/types';

import { Colors } from './Colors';
import { Company } from './Company';
import { Data } from './Data';
import { Files } from './Files';
import { Integrations } from './Integrations';

type Props = {
  tenantId: string;
  tenant: ExtendedTenant;
  isPending: boolean;
};

export const General = ({ tenantId, tenant, isPending }: Props) => {
  const styles = 'w-full rounded-md bg-gray-3 p-4';

  if (isPending) {
    return <Loader size="page" />;
  }
  return (
    <>
      {tenant.plan !== 'free' && (
        <section className={styles}>
          <Colors colors={tenant.color} tenantId={tenantId} />
        </section>
      )}
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
