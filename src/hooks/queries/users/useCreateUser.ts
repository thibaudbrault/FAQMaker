import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const createUser = async (values: User, tenantId: string) => {
  const body = { ...values, tenantId };
  const { data } = await axios.post(Routes.API.USERS, body);
  return data;
};

export const useCreateUser = (tenantId: string, reset: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: User) => createUser(values, tenantId),
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
