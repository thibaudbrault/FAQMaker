import { toast } from 'sonner';

export const errorToast = (error?: string) => {
  return toast.error(error ? error : `Something went wrong`);
};

export const successToast = (text: string) => {
  const toastText = text ?? `Done`;
  return toast.success(toastText);
};
