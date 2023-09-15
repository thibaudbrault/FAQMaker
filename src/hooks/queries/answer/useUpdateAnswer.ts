import { Answer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const updateAnswer = async (values: Answer, id: string, userId: string) => {
  const { data } = await axios.put(`${Routes.API.ANSWERS}/${id}`, {
    params: {
      ...values,
      id,
      userId,
    },
  });
  return data;
};

export const useUpdateAnswer = (
  id: string,
  userId: string,
  tenantId: string,
  router: NextRouter,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Answer) => updateAnswer(values, id, userId),
    onSuccess: (data) => {
      successToast(data.message);
      router.push('/');
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, tenantId],
      });
    },
  });
  return mutation;
};
