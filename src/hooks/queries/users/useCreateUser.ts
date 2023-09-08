import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { Routes } from '@/utils';

const createUser = async (values: User, tenantId: string) => {
  const body = { ...values, tenantId };
  await axios.post(Routes.API.USER, body);
};

export const useCreateUser = (tenantId: string, reset: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: User) => createUser(values, tenantId),
    onSuccess: () => {
      successToast('User created successfully');
      reset();
      queryClient.invalidateQueries({
        queryKey: ['users', tenantId],
      });
    },
  });
  return mutation;
};
