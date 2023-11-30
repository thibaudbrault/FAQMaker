import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { successToast } from '@/components';
import { createUserClientSchema } from '@/lib';
import { Routes } from '@/utils';

type Schema = z.infer<typeof createUserClientSchema>;

const upsertIntegrations = async (values: Schema, tenantId: string) => {
  const body = { ...values, tenantId };
  const { data } = await axios.post(Routes.API.INTEGRATIONS, body);
  return data;
};

export const useUpsertIntegrations = (tenantId: string) => {
  const mutation = useMutation({
    mutationFn: (values: Schema) => upsertIntegrations(values, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
    },
  });
  return mutation;
};
