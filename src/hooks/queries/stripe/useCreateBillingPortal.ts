import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { Routes } from '@/utils';

const createBillingPortal = async (tenantId: string) => {
  const body = { tenantId };
  await axios.post(Routes.API.BILLING, body);
  // const { data } = await axios.post(Routes.API.BILLING, body);
  // return data;
};

export const useCreateBillingPortal = (
  tenantId: string,
  router: NextRouter,
) => {
  const mutation = useMutation({
    mutationFn: () => createBillingPortal(tenantId),
    // onSuccess: (data) => {
    //   router.push(data);
    // },
  });
  return mutation;
};
