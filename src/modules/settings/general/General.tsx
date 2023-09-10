import { Tenant } from '@prisma/client';

import { Colors } from './Colors';
import { Company } from './Company';
import { Data } from './Data';

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
      <section className="relative">
        <Colors />
      </section>
      <section className="relative">
        <Company tenant={tenant} isLoading={isTenantLoading} />
      </section>
      <section className="relative">
        <Data nodesCount={nodesCount} usersCount={usersCount} />
      </section>
    </>
  );
};
