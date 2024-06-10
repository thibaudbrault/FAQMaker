import { toast } from 'sonner';

import type { AxiosResponse } from 'axios';

export const errorToast = (error?: string) => {
  return toast.error(error || `Something went wrong`);
};

export const successToast = (text: string) => {
  const toastText = text ?? `Done`;
  return toast.success(toastText);
};

export const promiseToast = (
  promise: Promise<any> | (() => Promise<any>),
  loading: string,
) => {
  return toast.promise(promise, {
    loading,
    success: (data: AxiosResponse['data']) => {
      return `${data.message}`;
    },
    error: (data) => {
      if (data.response.data.error) {
        return `${data.response.data.error.message}`;
      }
      return 'Something went wrong';
    },
  });
};
