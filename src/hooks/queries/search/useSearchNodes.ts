import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ExtendedNode } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getSearchNodes = async (tenantId: string, searchQuery: string) => {
  const { data } = await axios.get(Routes.API.SEARCH.INDEX, {
    params: { tenantId, searchQuery },
  });
  return data;
};

export const useSearchNodes = (tenantId: string, searchQuery: string) => {
  const query = useQuery<ExtendedNode[], AxiosError>({
    queryKey: [QueryKeys.SEARCH, tenantId, searchQuery],
    queryFn: () => getSearchNodes(tenantId, searchQuery),
    enabled: !!searchQuery,
  });
  return query;
};
