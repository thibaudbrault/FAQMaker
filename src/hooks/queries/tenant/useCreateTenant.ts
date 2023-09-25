import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { successToast } from '@/components';
import { Routes } from '@/utils';
import { NextRouter } from 'next/router';

const createTenant = async (values) => {
  const body = {
    ...values,
  };
  const { data } = await axios.post(Routes.API.TENANT, body);
  return data;
};

export const useCreateTenant = (router: NextRouter) => {
  const mutation = useMutation({
    mutationFn: (values) => createTenant(values),
    onSuccess: (data) => {
      successToast(data.message);
      router.push('/');
    },
  });
  return mutation;
};
