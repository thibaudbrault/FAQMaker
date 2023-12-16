import { Integrations } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getIntegration = async (tenantId: string) => {
  const { data } = await axios.get(
    `${Routes.API.INTEGRATIONS.INDEX}/${tenantId}`,
  );
  return data;
};

export const useIntegration = (tenantId: string) => {
  const query = useQuery<Integrations, AxiosError>({
    queryKey: [QueryKeys.INTEGRATION, tenantId],
    queryFn: () => getIntegration(tenantId),
  });
  return query;
};
