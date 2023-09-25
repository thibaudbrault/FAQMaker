import { Tenant } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';

import { successToast } from '@/components';
import { QueryKeys, Routes } from '@/utils';

const updateTenant = async (values: Tenant, id: string) => {
  const body = {
    ...values,
  };
  const { data } = await axios.put(`${Routes.API.TENANT}/${id}`, body);
  return data;
};

export const useUpdateTenant = (id: string, router: NextRouter) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: Tenant) => updateTenant(values, id),
    onSuccess: (data) => {
      successToast(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT, id],
      });
      router.reload();
    },
  });
  return mutation;
};
