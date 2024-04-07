import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/navigation';
import { z } from 'zod';

import { successToast } from '@/components';
import { updateTenantClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof updateTenantClientSchema>;

const updateTenant = async (values: Schema, id: string) => {
  const body = {
    ...values,
  };
  const { data } = await axios.put(`${Routes.API.TENANT.INDEX}/${id}`, body);
  return data;
};

export const useUpdateTenant = (id: string, router: NextRouter) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: Schema) => updateTenant(values, id),
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
