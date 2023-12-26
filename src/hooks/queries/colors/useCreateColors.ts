import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { successToast } from '@/components';
import { colorsClientSchema } from '@/lib';
import { Routes } from '@/utils';

type Schema = z.infer<typeof colorsClientSchema>;

const createColors = async (values: Schema, tenantId: string) => {
  const body = { ...values, tenantId };
  const { data } = await axios.post(Routes.API.COLORS, body);
  return data;
};

export const useCreateColors = (tenantId: string) => {
  const mutation = useMutation({
    mutationFn: (values: Schema) => createColors(values, tenantId),
    onSuccess: (data) => {
      successToast(data.message);
    },
  });
  return mutation;
};
