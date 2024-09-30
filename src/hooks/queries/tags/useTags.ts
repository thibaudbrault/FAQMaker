import { Tag } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getTags = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.TAGS, { params: { tenantId } });
  return data;
};

export const useTags = (tenantId: string) => {
  const query = useQuery<Tag[], AxiosError>({
    queryKey: [QueryKeys.TAGS, tenantId],
    queryFn: () => getTags(tenantId),
  });
  return query;
};
