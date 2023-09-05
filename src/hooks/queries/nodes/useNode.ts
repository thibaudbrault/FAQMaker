import { ExtendedNode } from '@/types';
import { QueryKeys, Routes } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const getNode = async (tenantId: string, id: string) => {
  const { data } = await axios.get(`${Routes.API.NODES}/${id}`, {
    params: { tenantId },
  });
  return data;
};

export const useNode = (tenantId: string, id: string) => {
  const query = useQuery<ExtendedNode, AxiosError>({
    queryKey: [QueryKeys.NODE, tenantId, id],
    queryFn: () => getNode(tenantId, id),
  });
  return query;
};
