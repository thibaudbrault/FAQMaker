import { Tag } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const createTag = async (values: Tag, tenantId: string) => {
  const body = {
    ...values,
    tenantId,
  };
  const { data } = await axios.post(Routes.API.TAGS, body);
  return data;
};

export const useCreateTag = (tenantId: string, reset: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Tag) => createTag(values, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TAGS, tenantId],
      });
    },
  });
  return mutation;
};
