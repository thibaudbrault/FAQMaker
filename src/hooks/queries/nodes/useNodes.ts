import { QueryKeys, Routes } from '@/utils';
import { Answer, Node, Question, Tag } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const getNodes = async (tenantId: string) => {
  const { data } = await axios.get(Routes.API.NODES, { params: { tenantId } });
  return data;
};

type ExtendedNode = Node & {
  question: Question;
  answer: Answer;
  tags: Tag[];
};

export const useNodes = (tenantId: string) => {
  const query = useQuery<ExtendedNode[], AxiosError>({
    queryKey: [QueryKeys.NODES, tenantId],
    queryFn: () => getNodes(tenantId),
  });
  return query;
};
