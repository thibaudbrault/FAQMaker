import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { successToast } from '@/components';
import { createUserClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof createUserClientSchema>;

const createUser = async (values: Schema, tenantId: string) => {
  const body = { ...values, tenantId };
  const { data } = await axios.post(Routes.API.USERS.INDEX, body);
  return data;
};

export const useCreateUser = (tenantId: string, reset: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Schema) => createUser(values, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
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
