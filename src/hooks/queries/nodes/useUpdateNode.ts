import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';
import { Question } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import slugify from 'slugify';

const updateNode = async (
  values: Question,
  id: string,
  tenantId: string,
  questionId: string,
) => {
  const { data } = await axios.put(`${Routes.API.NODES}/${id}`, {
    params: {
      values,
      tenantId,
      questionId,
      slug: slugify(values.text),
    },
  });
  return data;
};

export const useUpdateNode = (
  id: string,
  tenantId: string,
  questionId: string,
  reset: () => void,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Question) =>
      updateNode(values, id, tenantId, questionId),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODE, tenantId, id],
      });
    },
  });
  return mutation;
};
