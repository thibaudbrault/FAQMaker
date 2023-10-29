import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { updateUserClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';
import { z } from 'zod';

type Schema = z.infer<typeof updateUserClientSchema>;

const updateUser = async (values: Schema, id: string, tenantId: string) => {
  const body = {
    ...values,
    tenantId,
  };
  const { data } = await axios.put(`${Routes.API.USERS}/${id}`, body);
  return data;
};

export const useUpdateUser = (id: string, tenantId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: Schema) => updateUser(values, id, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS, tenantId],
      });
    },
  });
  return mutation;
};
