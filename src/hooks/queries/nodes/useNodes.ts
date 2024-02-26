import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ExtendedNode } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getNodes = async (tenantId: string, page: number) => {
  const { data } = await axios.get(Routes.API.NODES.INDEX, {
    params: { tenantId, page },
  });
  return data;
};

export const useNodes = (tenantId: string, page: number) => {
  const query = useQuery<ExtendedNode[], AxiosError>({
    queryKey: [QueryKeys.NODES, tenantId, page],
    queryFn: () => getNodes(tenantId, page),
  });
  return query;
};
