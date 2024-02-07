import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getNodesCount = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.NODES.COUNT, {
    params: { tenantId },
  });
  return data;
};

export const useNodesCount = (tenantId: string) => {
  const query = useQuery<number, AxiosError>({
    queryKey: [QueryKeys.NODES_COUNT, tenantId],
    queryFn: () => getNodesCount(tenantId),
  });
  return query;
};
