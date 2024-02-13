import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { promiseToast } from '@/components';
import { filesClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof filesClientSchema>;

const upsertFiles = async (values: Schema, id: string) => {
  const formData = new FormData();
  Object.values(values).forEach((file) => {
    formData.append('logo', file);
  });
  formData.append('tenantId', id);
  const { data } = await axios.post(Routes.API.STORAGE.LOGO, formData);
  return data;
};

export const useUpsertFiles = (id: string) => {
  const queryClient = useQueryClient();
  const upsertFilesMutation = async (values: Schema) => {
    const promise = upsertFiles(values, id);
    promiseToast(promise, 'Uploading files...');
    return promise;
  };
  const mutation = useMutation({
    mutationFn: upsertFilesMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT, id],
      });
    },
  });
  return mutation;
};
