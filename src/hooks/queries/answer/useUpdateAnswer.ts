import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import { z } from 'zod';

import { promiseToast } from '@/components';
import { answerClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof answerClientSchema>;

const updateAnswer = async (values: Schema, userId: string, id?: string) => {
  const body = {
    ...values,
    userId,
  };
  const { data } = await axios.put(`${Routes.API.ANSWERS}/${id}`, body);
  return data;
};

export const useUpdateAnswer = (
  userId: string,
  tenantId: string,
  router: NextRouter,
  id?: string,
) => {
  const queryClient = useQueryClient();
  const updateAnswerMutation = async (values: Schema) => {
    const promise = updateAnswer(values, userId, id);
    promiseToast(promise, 'Updating answer...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: updateAnswerMutation,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, tenantId],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
