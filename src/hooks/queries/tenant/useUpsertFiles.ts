import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { promiseToast } from '@/components';
import { filesClientSchema } from '@/lib';
import { QueryKeys, Routes } from '@/utils';

type Schema = z.infer<typeof filesClientSchema>;

const upsertFiles = async (values: Schema, id: string) => {
  try {
    const { logo: file } = values;
    const randomId = uuid();
    const filename = encodeURIComponent(randomId + file.name);
    const { data: signedData } = await axios.post(
      `${Routes.API.STORAGE.LOGO}?file=${filename}`,
    );
    const { url, fields } = signedData;
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });
    await axios.post(url, formData);
    const body = {
      logoUrl: url + 'logos/' + filename,
      filename,
    };
    const { data } = await axios.put(`${Routes.API.TENANT.LOGO}/${id}`, body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const useUpsertFiles = (id: string) => {
  const queryClient = useQueryClient();
  const upsertFilesMutation = async (values: Schema) => {
    const promise = upsertFiles(values, id);
    promiseToast(promise, 'Uploading files...');
    return promise;
  };
  const mutation = useMutation({
    mutationFn: upsertFilesMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT, id],
      });
    },
  });
  return mutation;
};
