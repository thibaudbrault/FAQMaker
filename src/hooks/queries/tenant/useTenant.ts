import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ExtendedTenant } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getTenant = async (tenantId: string) => {
  const { data } = await axios.get(`${Routes.API.TENANT}/${tenantId}`);
  return data;
};

export const useTenant = (tenantId: string) => {
  const query = useQuery<ExtendedTenant, AxiosError>({
    queryKey: [QueryKeys.TENANT, tenantId],
    queryFn: () => getTenant(tenantId),
  });
  return query;
};
