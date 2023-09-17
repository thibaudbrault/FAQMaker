import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { ClientUser } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const createUser = async (values: ClientUser, tenantId: string) => {
  const body = { ...values, tenantId };
  await axios.post(Routes.API.USERS, body);
};

export const useCreateUser = (tenantId: string, reset: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: ClientUser) => createUser(values, tenantId),
    onSuccess: () => {
      successToast('User created successfully');
      reset();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS, tenantId],
      });
    },
  });
  return mutation;
};
