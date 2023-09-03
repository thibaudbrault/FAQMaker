import { successToast } from '@/components';
import { Routes } from '@/utils';
import { Question, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import slugify from 'slugify';

const createNode = async (values: Question, user: User) => {
  const body = {
    ...values,
    slug: slugify(values.text),
    tenantId: user.tenantId,
    userId: user.id,
  };
  const { data } = await axios.post(Routes.API.NODES, body);
  return data;
};

export const useCreateNode = (user: User, reset: () => void) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Question) => createNode(values, user),
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
