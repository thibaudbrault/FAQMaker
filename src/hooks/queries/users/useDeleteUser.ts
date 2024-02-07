import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const deleteUser = async (tenantId: string, id: string) => {
  const data = { tenantId };
  const { data: deleteData } = await axios.delete(
    `${Routes.API.USERS.INDEX}/${id}`,
    {
      data,
    },
  );
  return deleteData;
};

type MutationParams = {
  id: string;
};

export const useDeleteUser = (tenantId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id }: MutationParams) => deleteUser(tenantId, id),
    onSuccess: (data) => {
      successToast(data.message);
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
