import { Question, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import slugify from 'slugify';

import { successToast } from '@/components';
import { Routes } from '@/utils';

const createNode = async (
  values: Question,
  user: User,
  selectedTags: String[],
) => {
  const body = {
    ...values,
    slug: slugify(values.text),
    tenantId: user.tenantId,
    userId: user.id,
    tags: selectedTags,
  };
  const { data } = await axios.post(Routes.API.NODES, body);
  return data;
};

export const useCreateNode = (
  user: User,
  selectedTags: String[],
  reset: () => void,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Question) => createNode(values, user, selectedTags),
    onSuccess: (data) => {
      successToast(data.message);
      reset();
      queryClient.invalidateQueries({
        queryKey: ['nodes', user.tenantId],
      });
    },
  });
  return mutation;
};
