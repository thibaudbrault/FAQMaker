import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getUserAnswers = async (userId: string) => {
  const { data } = await axios.get(Routes.API.ANSWERS, {
    params: { userId },
  });
  return data;
};

export type NodeWithQuestionAndAnswer = {
  id: string;
  answer: {
    text: string;
  };
  question: {
    id: string;
    slug: string;
    text: string;
  };
};

export const useUserAnswers = (userId: string) => {
  const query = useQuery<NodeWithQuestionAndAnswer[], AxiosError>({
    queryKey: [QueryKeys.ANSWERS, userId],
    queryFn: () => getUserAnswers(userId),
  });
  return query;
};
