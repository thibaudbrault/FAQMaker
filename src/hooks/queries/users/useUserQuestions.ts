import { Question } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { QueryKeys, Routes } from '@/utils';

const getUserQuestions = async (userId: string) => {
  const { data } = await axios.get(Routes.API.QUESTIONS, {
    params: { userId },
  });
  return data;
};

type QuestionWithNodeId = Question & {
  node: {
    id: string;
  };
};

export const useUserQuestions = (userId: string) => {
  const query = useQuery<QuestionWithNodeId[], AxiosError>({
    queryKey: [QueryKeys.QUESTIONS, userId],
    queryFn: () => getUserQuestions(userId),
  });
  return query;
};
