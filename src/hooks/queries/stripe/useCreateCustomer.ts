import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { Routes } from '@/utils';

const createCustomer = async (values) => {
  const body = {
    ...values,
  };
  const { data } = await axios.post(Routes.API.CUSTOMER, body);
  const customerId = data.customerId;
  return customerId;
};

export const useCreateCustomer = () => {
  const mutation = useMutation({
    mutationFn: (values) => createCustomer(values),
  });
  return mutation;
};
