import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ExtendedNode } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getNodes = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.NODES, {
    params: { tenantId },
  });
  return data;
};

export const useNodes = (tenantId: string) => {
  const query = useQuery<ExtendedNode[], AxiosError>({
    queryKey: [QueryKeys.NODES, tenantId],
    queryFn: () => getNodes(tenantId),
  });
  return query;
};
