import { Question, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import slugify from 'slugify';

import { promiseToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const createNode = async (
  values: Question,
  me: User,
  selectedTags: string[],
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
  me: User,
  router: NextRouter,
  selectedTags: string[],
) => {
  const queryClient = useQueryClient();
  const createNodeMutation = async (values: Question) => {
    const promise = createNode(values, me, selectedTags);
    promiseToast(promise, 'Creating question...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: createNodeMutation,
    onMutate: async (values) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.NODES, me.tenantId],
      });
      const previousNodes = queryClient.getQueryData([
        QueryKeys.NODES,
        me.tenantId,
      ]);
      queryClient.setQueryData([QueryKeys.NODES, me.tenantId], (oldNodes) => [
        oldNodes ?? [],
        values,
      ]);
      return { previousNodes };
    },
    onError: (_error, _values, context) => {
      queryClient.setQueryData(
        [QueryKeys.NODES, me.tenantId],
        context.previousNodes,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, me.tenantId],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
