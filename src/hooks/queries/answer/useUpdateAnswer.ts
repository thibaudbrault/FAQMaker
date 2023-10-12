import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { promiseToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const updateAnswer = async (values: Answer, id: string, userId: string) => {
  const body = {
    ...values,
    userId,
  };
  const { data } = await axios.put(`${Routes.API.ANSWERS}/${id}`, body);
  return data;
};

export const useUpdateAnswer = (
  id: string,
  userId: string,
  tenantId: string,
  router: NextRouter,
) => {
  const queryClient = useQueryClient();
  const updateAnswerMutation = async (values: Answer) => {
    const promise = updateAnswer(values, id, userId);
    promiseToast(promise, 'Updating answer...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: updateAnswerMutation,
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
