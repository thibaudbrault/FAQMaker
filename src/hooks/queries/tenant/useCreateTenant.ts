import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import { z } from 'zod';

import { successToast } from '@/components';
import { registerCompleteClientSchema } from '@/lib';
import { Routes } from '@/utils';

type Schema = z.infer<typeof registerCompleteClientSchema>;
type ExtendedSchema = Schema & {
  customerId: string;
};

const createTenant = async (values: ExtendedSchema) => {
  const body = {
    ...values,
  };
  const { data } = await axios.post(Routes.API.TENANT, body);
  return data;
};

export const useCreateTenant = (router: NextRouter) => {
  const mutation = useMutation({
    mutationFn: (values: ExtendedSchema) => createTenant(values),
    onSuccess: (data) => {
      successToast(data.message);
      router.push(Routes.SITE.REGISTER.PLAN);
    },
  });
  return mutation;
};
