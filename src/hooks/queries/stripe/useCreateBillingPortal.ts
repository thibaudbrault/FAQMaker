import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { Routes } from '@/utils';
import { NextRouter } from 'next/router';

const createBillingPortal = async (tenantId: string) => {
  const body = { tenantId };
  const { data } = await axios.post(Routes.API.BILLING, body, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  return data;
};

export const useCreateBillingPortal = (
  tenantId: string,
  router: NextRouter,
) => {
  const mutation = useMutation({
    mutationFn: () => createBillingPortal(tenantId),
    onSuccess: (data) => {
      router.push(data);
    },
  });
  return mutation;
};
