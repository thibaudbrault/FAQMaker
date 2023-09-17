import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const deleteUser = async (tenantId: string, id: string) => {
  const { data } = await axios.delete(`${Routes.API.USERS}/${id}`, {
    params: { tenantId },
  });
  return data;
};

type MutationParams = {
  id: string;
};

export const useDeleteUser = (tenantId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id }: MutationParams) => deleteUser(tenantId, id),
    onSuccess: () => {
      successToast('User deleted');
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS, tenantId],
      });
    },
  });
  return mutation;
};
