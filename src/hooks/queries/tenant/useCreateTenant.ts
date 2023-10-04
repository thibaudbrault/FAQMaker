import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { successToast } from '@/components';
import { Routes } from '@/utils';

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
      router.push('/register/plan');
    },
  });
  return mutation;
};
