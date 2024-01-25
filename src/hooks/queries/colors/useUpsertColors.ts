import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NextRouter } from 'next/router';
import { z } from 'zod';

import { successToast } from '@/components';
import { colorsClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof colorsClientSchema>;

const upsertColors = async (values: Schema, tenantId: string) => {
  const body = { ...values, tenantId };
  console.log(body);
  const { data } = await axios.post(Routes.API.COLORS, body);
  return data;
};

export const useUpsertColors = (tenantId: string, router: NextRouter) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Schema) => upsertColors(values, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT, tenantId],
      });
      router.push('/');
    },
  });
  return mutation;
};
