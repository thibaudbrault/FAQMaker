import { toast } from 'sonner';

export const errorToast = (error?: string) => {
  return toast.error(error || `Something went wrong`);
};

export const successToast = (text: string) => {
  const toastText = text ?? `Done`;
  return toast.success(toastText);
};

export const promiseToast = (
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
  promise: Promise<any> | (() => Promise<any>),
  loading: string,
) => {
  return toast.promise(promise, {
    loading,
    success: (data) => {
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

export const resultToast = (
  error: string | undefined,
  success: string | undefined,
) => {
  if (error) {
    return errorToast(error);
  }
  if (success) {
    return successToast(success);
  }
  return null;
};
