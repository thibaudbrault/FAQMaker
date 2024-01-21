import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { promiseToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const createUsers = async (newArray: string[], tenantId: string) => {
  const body = { newArray, tenantId };
  const { data } = await axios.post(Routes.API.USERS, body);
  return data;
};

export const useCreateUsers = (tenantId: string, newArray: string[]) => {
  const queryClient = useQueryClient();
  const createUsersMutation = async () => {
    const promise = createUsers(newArray, tenantId);
    promiseToast(promise, 'Creating users ...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: createUsersMutation,
    onSuccess: () => {
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
