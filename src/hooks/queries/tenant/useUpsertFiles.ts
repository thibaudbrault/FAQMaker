import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

import { filesClientSchema } from '@/lib';
import { Routes } from '@/utils';

type Schema = z.infer<typeof filesClientSchema>;

const upsertFiles = async (values: Schema, id: string) => {
  const formData = new FormData();
  Object.values(values).forEach((file) => {
    formData.append('logo', file);
  });
  const { data } = await axios.post(Routes.API.STORAGE.LOGO, formData);
  // const { data } = await axios.put(`${Routes.API.TENANT}/${id}`, body);
  // return data;
};

export const useUpsertFiles = (id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: Schema) => upsertFiles(values, id),
    // onSuccess: (data) => {
    //   successToast(data.message);
    //   queryClient.invalidateQueries({
    //     queryKey: [QueryKeys.TENANT, id],
    //   });
    // },
  });
  return mutation;
};
