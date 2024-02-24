import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { promiseToast } from '@/components';
import { createTagClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof createTagClientSchema>;

const createTag = async (values: Schema, tenantId: string) => {
  const body = {
    ...values,
    tenantId,
  };
  const { data } = await axios.post(Routes.API.TAGS, body);
  return data;
};

export const useCreateTag = (tenantId: string, reset: () => void) => {
  const queryClient = useQueryClient();
  const createTagMutation = async (values: Schema) => {
    const promise = createTag(values, tenantId);
    promiseToast(promise, 'Creating tag...');
    return promise;
  };
  const mutation = useMutation({
    mutationFn: createTagMutation,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TAGS, tenantId],
      });
    },
  });
  return mutation;
};
