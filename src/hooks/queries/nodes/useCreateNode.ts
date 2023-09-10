import { Question } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import slugify from 'slugify';

import { successToast } from '@/components';
import { ClientUser } from '@/types';
import { QueryKeys, Routes } from '@/utils';

const createNode = async (
  values: Question,
  me: ClientUser,
  selectedTags: String[],
) => {
  const body = {
    ...values,
    slug: slugify(values.text),
    tenantId: me.tenantId,
    userId: me.id,
    tags: selectedTags,
  };
  const { data } = await axios.post(Routes.API.NODES, body);
  return data;
};

export const useCreateNode = (
  me: ClientUser,
  router: NextRouter,
  selectedTags: String[],
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Question) => createNode(values, me, selectedTags),
    onSuccess: (data) => {
      successToast(data.message);
      router.push('/');
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, me.tenantId],
      });
    },
  });
  return mutation;
};
