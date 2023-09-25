import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const deleteTag = async (tenantId: string, id: string) => {
  const data = { tenantId };
  const { data: deleteData } = await axios.delete(`${Routes.API.TAGS}/${id}`, {
    data,
  });
  return deleteData;
};

type MutationParams = {
  id: string;
};

export const useDeleteTag = (tenantId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id }: MutationParams) => deleteTag(tenantId, id),
    onSuccess: (data) => {
      successToast(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TAGS, tenantId],
      });
    },
  });
  return mutation;
};
