import { Integrations, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/navigation';
import slugify from 'slugify';
import { z } from 'zod';

import { errorToast, promiseToast } from '@/components';
import { questionClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof questionClientSchema>;

const createNode = async (
  values: Schema,
  me: User,
  selectedTags: string[],
  integrations: Integrations,
) => {
  const body = {
    ...values,
    slug: slugify(values.text).toLowerCase(),
    tenantId: me.tenantId,
    userId: me.id,
    tags: selectedTags,
  };
  const { data } = await axios.post(Routes.API.NODES.INDEX, body);
  if (integrations) {
    if (integrations.slack) {
      try {
        const slackBody = {
          text: values.text,
          url: integrations.slack,
        };
        const { data } = await axios.post(
          Routes.API.INTEGRATIONS.SLACK,
          slackBody,
        );
        return data;
      } catch (error) {
        errorToast('Error sending Slack webhook: ' + error.message);
      }
    }
  }
  return data;
};

export const useCreateNode = (
  me: User,
  router: NextRouter,
  selectedTags: string[],
  integrations: Integrations,
) => {
  const queryClient = useQueryClient();
  const createNodeMutation = async (values: Schema) => {
    const promise = createNode(values, me, selectedTags, integrations);
    promiseToast(promise, 'Creating question...');
    return promise;
  };

  const mutation = useMutation({
    mutationFn: createNodeMutation,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, me.tenantId],
      });
      if (data.node) {
        router.push({
          pathname: Routes.SITE.ANSWER,
          query: { id: data.node.id },
        });
      } else {
        router.push(Routes.SITE.HOME);
      }
    },
  });
  return mutation;
};
