import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { promiseToast } from '@/components';
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
  const createAnswerMutation = async (values: Answer) => {
    const promise = createAnswer(values, nodeId, userId);
    promiseToast(promise, 'Creating answer...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: createAnswerMutation,
    onMutate: async (values) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.NODES, tenantId],
      });
      const previousNodes = queryClient.getQueryData([
        QueryKeys.NODES,
        tenantId,
      ]);
      queryClient.setQueryData([QueryKeys.NODES, tenantId], (oldNodes) => [
        oldNodes ?? [],
        values,
      ]);
      return { previousNodes };
    },
    onError: (_error, _values, context) => {
      queryClient.setQueryData(
        [QueryKeys.NODES, tenantId],
        context.previousNodes,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, tenantId],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
