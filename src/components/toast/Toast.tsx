import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

export const errorToast = (error?: string) => {
  return toast.error(error ? error : `Something went wrong`);
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
    loading: loading,
    success: (data: AxiosResponse['data']) => {
      return `${data.message}`;
    },
    error: (data) => {
      return `${data.response.data.message}`;
    },
  });
};
