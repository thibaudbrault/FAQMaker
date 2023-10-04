import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { ClientUser } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const updateUser = async (values: ClientUser, id: string, tenantId: string) => {
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
    mutationFn: (values: ClientUser) => updateUser(values, id, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS, tenantId],
      });
    },
  });
  return mutation;
};
