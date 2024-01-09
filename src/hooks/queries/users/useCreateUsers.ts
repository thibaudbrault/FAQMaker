import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { errorToast, successToast } from '@/components';
import { csvUploadClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof csvUploadClientSchema>;

const createUsers = async (values: Schema, csvData, tenantId: string) => {
  const body = { ...values, csvData, tenantId };
  const { data } = await axios.post(Routes.API.USERS, body);
  return data;
};

export const useCreateUsers = (tenantId: string, csvData) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Schema) => createUsers(values, csvData, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS, tenantId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS_COUNT, tenantId],
      });
    },
    onError: (data: any) => {
      errorToast(data.response.data.message);
      console.error(data.response.data.errors);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS, tenantId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS_COUNT, tenantId],
      });
    },
  });
  return mutation;
};
