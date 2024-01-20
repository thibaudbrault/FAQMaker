import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import { z } from 'zod';

import { promiseToast } from '@/components';
import { registerCompleteClientSchema } from '@/lib';
import { Routes } from '@/utils';

type Schema = z.infer<typeof registerCompleteClientSchema>;

const createTenant = async (values: Schema) => {
  const body = {
    ...values,
  };
  const { data } = await axios.post(Routes.API.TENANT, body);
  return data;
};

export const useCreateTenant = (router: NextRouter) => {
  const createTenantMutation = async (values: Schema) => {
    const promise = createTenant(values);
    promiseToast(promise, 'Creating account...');
    return promise;
  };
  const mutation = useMutation({
    mutationFn: createTenantMutation,
    onSuccess: async () => {
      router.push(Routes.SITE.REGISTER.PLAN);
    },
  });
  return mutation;
};
