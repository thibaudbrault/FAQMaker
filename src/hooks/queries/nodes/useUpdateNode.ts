import { Question } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import slugify from 'slugify';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const updateNode = async (
  values: Question,
  id: string,
  tenantId: string,
  questionId: string,
  userId: string,
  tags: string[],
) => {
  const { data } = await axios.put(`${Routes.API.NODES}/${id}`, {
    params: {
      ...values,
      tenantId,
      questionId,
      slug: slugify(values.text),
      userId,
      tags,
    },
  });
  return data;
};

export const useUpdateNode = (
  id: string,
  tenantId: string,
  questionId: string,
  userId: string,
  tags: string[],
  router: NextRouter,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Question) =>
      updateNode(values, id, tenantId, questionId, userId, tags),
    onSuccess: (data) => {
      successToast(data.message);
      router.push('/');
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODE, tenantId, id],
      });
    },
  });
  return mutation;
};
