import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const createAnswer = async (values: Answer, nodeId: string, userId: string) => {
  const body = {
    ...values,
    nodeId,
    userId,
  };
  const { data } = await axios.post(Routes.API.ANSWERS, body);
  return data;
};

export const useCreateAnswer = (
  nodeId: string,
  userId: string,
  tenantId: string,
  router: NextRouter,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Answer) => createAnswer(values, nodeId, userId),
    onSuccess: (data) => {
      successToast(data.message);
      router.push(Routes.SITE.HOME);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, tenantId],
      });
    },
  });
  return mutation;
};
