import { Integrations, User } from '@prisma/client';
import { IncomingWebhook } from '@slack/webhook';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import slugify from 'slugify';
import { z } from 'zod';

import { promiseToast } from '@/components';
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
    slug: slugify(values.text),
    tenantId: me.tenantId,
    userId: me.id,
    tags: selectedTags,
  };
  const { data } = await axios.post(Routes.API.NODES, body);
  if (integrations) {
    if (integrations.slack) {
      try {
        const url = integrations.slack;
        const webhook = new IncomingWebhook(url);
        await webhook.send({ text: values.text });
      } catch (error) {
        console.error('Error sending Slack webhook: ', error.message);
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
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.NODES, me.tenantId],
      });
      router.push(Routes.SITE.HOME);
    },
  });
  return mutation;
};
