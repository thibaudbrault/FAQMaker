import { toast } from 'react-hot-toast';

export const errorToast = (error?: string) => {
  return toast.error(error ? error : `Something went wrong`, {
    style: {
      fontSize: `1rem`,
    },
  });
};

export const successToast = (text: string) => {
  const toastText = text ?? `Done`;
  return toast.success(toastText, {
    style: {
      fontSize: `1rem`,
    },
  });
};
