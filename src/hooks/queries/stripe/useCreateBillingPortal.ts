import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { Routes } from '@/utils';

const createBillingPortal = async (tenantId: string) => {
  const body = { tenantId };
  const { data } = await axios.post(Routes.API.BILLING, body);
  return data;
};

export const useCreateBillingPortal = (tenantId: string) => {
  const mutation = useMutation({
    mutationFn: () => createBillingPortal(tenantId),
  });
  return mutation;
};
