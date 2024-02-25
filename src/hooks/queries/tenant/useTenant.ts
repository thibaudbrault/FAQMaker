import { Tenant } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getTenant = async (tenantId: string) => {
  const { data } = await axios.get(`${Routes.API.TENANT.INDEX}/${tenantId}`);
  return data;
};

export const useTenant = (tenantId: string) => {
  const query = useQuery<Tenant, AxiosError>({
    queryKey: [QueryKeys.TENANT, tenantId],
    queryFn: () => getTenant(tenantId),
  });
  return query;
};
