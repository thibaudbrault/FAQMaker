import { Company } from './Company';
import { Files } from './Files';

import type { Integrations, Tenant } from '@prisma/client';

type Props = {
  tenant: Tenant;
  integrations: Integrations | null;
};

export const General = ({ tenant, integrations }: Props) => {
  return (
    <div className="flex flex-col">
      <Company tenant={tenant} integrations={integrations} />
      <hr className="my-4 h-px border-none bg-gray-6" />
      <Files tenant={tenant} />
    </div>
  );
};
