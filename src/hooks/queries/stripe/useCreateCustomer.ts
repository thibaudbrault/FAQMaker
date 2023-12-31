import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { registerCompleteClientSchema } from '@/lib';
import { Routes } from '@/utils';

type Schema = z.infer<typeof registerCompleteClientSchema>;

const createCustomer = async (values: Schema) => {
  const body = {
    ...values,
  };
  const { data } = await axios.post(Routes.API.CUSTOMER, body);
  const customerId = data.customerId;
  return customerId;
};

export const useCreateCustomer = () => {
  const mutation = useMutation({
    mutationFn: (values: Schema) => createCustomer(values),
  });
  return mutation;
};
