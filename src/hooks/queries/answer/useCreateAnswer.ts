import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import { z } from 'zod';

import { promiseToast } from '@/components';
import { answerClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof answerClientSchema>;

const createAnswer = async (values: Schema, nodeId: string, userId: string) => {
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
  const createAnswerMutation = async (values: Schema) => {
    const promise = createAnswer(values, nodeId, userId);
    promiseToast(promise, 'Creating answer...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: createAnswerMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, tenantId],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
