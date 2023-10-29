import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import slugify from 'slugify';

import { promiseToast } from '@/components';
import { questionClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';
import { z } from 'zod';

type Schema = z.infer<typeof questionClientSchema>;

const updateNode = async (
  values: Schema,
  id: string,
  tenantId: string,
  userId: string,
  tags: string[],
  questionId?: string,
) => {
  const body = {
    ...values,
    tenantId,
    questionId,
    slug: slugify(values.text),
    userId,
    tags,
  };
  const { data } = await axios.put(`${Routes.API.NODES}/${id}`, body);
  return data;
};

export const useUpdateNode = (
  id: string,
  tenantId: string,
  userId: string,
  tags: string[],
  router: NextRouter,
  questionId?: string,
) => {
  const queryClient = useQueryClient();
  const updateNodeMutation = async (values: Schema) => {
    const promise = updateNode(values, id, tenantId, userId, tags, questionId);
    promiseToast(promise, 'Updating question...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: updateNodeMutation,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODE, tenantId, id],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
