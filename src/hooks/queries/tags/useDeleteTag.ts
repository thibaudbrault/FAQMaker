import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const deleteTag = async (tenantId: string, id: string) => {
  await axios.delete(`${Routes.API.TAGS}/${id}`, {
    params: { tenantId },
  });
};

type MutationParams = {
  id: string;
};

export const useDeleteTag = (tenantId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id }: MutationParams) => deleteTag(tenantId, id),
    onSuccess: () => {
      successToast('Tag deleted');
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TAGS, tenantId],
      });
    },
  });
  return mutation;
};
