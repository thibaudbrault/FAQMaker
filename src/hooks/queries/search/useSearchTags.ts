import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { ExtendedNode } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const getSearchTags = async (tenantId: string, searchTag: string) => {
  const { data } = await axios.get(Routes.API.SEARCH.TAGS, {
    params: { tenantId, searchTag },
  });
  return data;
};

export const useSearchTags = (tenantId: string, searchTag: string) => {
  const query = useQuery<ExtendedNode[], AxiosError>({
    queryKey: [QueryKeys.SEARCH, tenantId, searchTag],
    queryFn: () => getSearchTags(tenantId, searchTag),
    enabled: !!searchTag,
  });
  return query;
};
