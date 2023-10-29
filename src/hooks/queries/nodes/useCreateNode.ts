import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import slugify from 'slugify';

import { promiseToast } from '@/components';
import { questionClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';
import { z } from 'zod';

type Schema = z.infer<typeof questionClientSchema>;

const createNode = async (values: Schema, me: User, selectedTags: string[]) => {
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
  const createNodeMutation = async (values: Schema) => {
    const promise = createNode(values, me, selectedTags);
    promiseToast(promise, 'Creating question...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: createNodeMutation,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, me.tenantId],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
